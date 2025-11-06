const httpStatus = require("http-status");
const ledgerService = require("../ledger/services/ledger.service");
const doctorService = require("../doctorInfo/services/doctorInfo.service");
const walletService = require("../wallet/services/wallet.service");
const dailyService = require("../videoCall/services/daily.service");
const notificationService = require("../notifications/services/notifications.service");
const appointmentService = require("../appoinment/services/appointment.service");
const APIError = require("./APIError.helper");
const CONSTANTS = require("../helpers/Constants");

const monthShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formateDate(date) {
  const day = date.getDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();
  const dt = `${day} ${monthShort[month]} ${year}`;
  return dt;
}
module.exports.appointmentComplete = async (data, status = "COMPLETED") => {
  try {
    const appt = await appointmentService.patch(
      { ...data, status: { $in: ["PENDING", "FOLLOW_UP"] } },
      { $set: { status } }
    );
    if (!appt.appointmentId) {
      const code = `Err${CONSTANTS.MODULE_CODE.APPOINTMENT}${CONSTANTS.OPERATION_CODE.PATCH}${CONSTANTS.ERROR_TYPE.GENERIC}APPT`;
      throw new APIError(
        "Invalid Appointment Id",
        httpStatus.BAD_REQUEST,
        true,
        "Bad Request",
        code
      );
    }
    if (!appt.previousAppointmentId) {
      const ledger = await ledgerService.patch(
        {
          appointmentId: appt.appointmentId,
        },
        { $set: { status: "COMPLETED" } }
      );
      if (!ledger || !ledger.appointmentId) {
        const code = `Err${CONSTANTS.MODULE_CODE.APPOINTMENT}${CONSTANTS.OPERATION_CODE.PATCH}${CONSTANTS.ERROR_TYPE.GENERIC}LEDGER`;
        throw new APIError(
          "Invalid Ledger",
          httpStatus.BAD_REQUEST,
          true,
          "Bad Request",
          code
        );
      }
      const addFund = await walletService.addFundByUserId(
        ledger.destinationId,
        ledger.amount
      );
      if (!addFund || !addFund.walletId) {
        const code = `Err${CONSTANTS.MODULE_CODE.APPOINTMENT}${CONSTANTS.OPERATION_CODE.PATCH}${CONSTANTS.ERROR_TYPE.GENERIC}FUNDS`;
        throw new APIError(
          "Failed to add funds",
          httpStatus.BAD_REQUEST,
          true,
          "Bad Request",
          code
        );
      }
    }
    await dailyService.deleteRoom(appt.roomName);
    return { msg: "Successfully closed" };
  } catch (e) {
    throw e;
  }
};

module.exports.cancelOrReject = async (query, deduct, type, body, refund) => {
  try {
    const appt = await appointmentService.patch(query, {
      $set: { status: body.status },
    });
    if (!appt.appointmentId) {
      const code = `Err${CONSTANTS.MODULE_CODE.APPOINTMENT}${CONSTANTS.OPERATION_CODE.PATCH}${CONSTANTS.ERROR_TYPE.GENERIC}APPT`;
      throw new APIError(
        "Invalid Appointment Id",
        httpStatus.BAD_REQUEST,
        true,
        "Bad Request",
        code
      );
    }
    const ledger = await ledgerService.patch(
      {
        appointmentId: appt.appointmentId,
      },
      { $set: { status: refund } }
    );
    if (!ledger || !ledger.appointmentId) {
      const code = `Err${CONSTANTS.MODULE_CODE.APPOINTMENT}${CONSTANTS.OPERATION_CODE.PATCH}${CONSTANTS.ERROR_TYPE.GENERIC}LEDGER`;
      throw new APIError(
        "Invalid Ledger",
        httpStatus.BAD_REQUEST,
        true,
        "Bad Request",
        code
      );
    }
    let revertAmt = 0
    if (body.status === "REJECT") {
      revertAmt = ledger.amount + ledger.applicationFee
    } else if (body.status === "CANCEL") {
      revertAmt = deduct * ledger.amount;
    }
    const addFund = await walletService.addFundByUserId(
      ledger.sourceId,
      revertAmt
    );
    if (!addFund || !addFund.walletId) {
      const code = `Err${CONSTANTS.MODULE_CODE.APPOINTMENT}${CONSTANTS.OPERATION_CODE.PATCH}${CONSTANTS.ERROR_TYPE.GENERIC}FUNDS`;
      throw new APIError(
        "Failed to add funds",
        httpStatus.BAD_REQUEST,
        true,
        "Bad Request",
        code
      );
    }
    return { msg: "Successfully closed" };
  } catch (e) {
    throw e;
  }
};

module.exports.extendAppointment = async (data, user) => {
  try {
    const appt = await appointmentService.fetchOne({
      ...data,
      status: "PENDING",
    });
    if (!appt.appointmentId) {
      const code = `Err${CONSTANTS.MODULE_CODE.APPOINTMENT}${CONSTANTS.OPERATION_CODE.PATCH}${CONSTANTS.ERROR_TYPE.GENERIC}APPT`;
      throw new APIError(
        "Invalid Appointment Id",
        httpStatus.BAD_REQUEST,
        true,
        "Bad Request",
        code
      );
    }
    const doctorInfo = await doctorService.fetchOne({
      doctorId: appt.doctorId,
      isDefault: true,
    });
    if (!doctorInfo) {
      const code = `Err${CONSTANTS.MODULE_CODE.APPOINTMENT}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.GENERIC}doctor`;
      throw new APIError(
        "Failed to Get Doctor",
        httpStatus.NOT_FOUND,
        true,
        "Bad Request",
        code
      );
    }
    const info = doctorInfo.toObject();
    const date = appt.schedule.date;
    const day = date.getDate();
    const month = date.getUTCMonth();
    const year = date.getUTCFullYear();
    const dt = `${day} ${monthShort[month]} ${year}`;

    const list = ["PENDING", "ACCEPTED", "COMPLETED"];
    const fullApptList = await appointmentService.fetch({
      doctorId: appt.doctorId,
      "schedule.date": { $eq: dt },
      status: { $in: list },
    });

    const response = appointmentService.process(
      info,
      fullApptList,
      appt.schedule.date,
      user
    );
    const { nextSlot } = appointmentService.findNextSlot(appt, response);

    const nextAppt = await appointmentService.fetchOne({
      doctorId: appt.doctorId,
      "schedule.date": { $eq: dt },
      "schedule.time": nextSlot.time,
      status: "PENDING",
    });
    if (nextAppt.mobileNo) {
      await notificationService.sendSms(
        nextAppt.mobileNo,
        `Hi, There is a slight delay in your appointment ${formateDate(
          nextAppt.schedule.date
        )} ${nextAppt.schedule.time
        }. please join and wait for the doctor. thanks for the understanding`
      );
    }
    return { msg: "Successfully closed" };
  } catch (e) {
    throw e;
  }
};
