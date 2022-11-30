import AWS from "aws-sdk";
import { EEmailTemplate, IContent, IMailParams } from "./types";

// Set the region
const region = process.env.AWSREGION ?? "";
AWS.config.update({ region });

const ses = new AWS.SES();

const emailBody = {
  otp: 'FILE_PATH_TO_EMAIL_TEMPLATE',
  forgotPassword: 'FILE_PATH_TO_EMAIL_TEMPLATE',
  changePassword: 'FILE_PATH_TO_EMAIL_TEMPLATE',
  socialSignup:'FILE_PATH_TO_EMAIL_TEMPLATE',
};

const subject = {
  otp: "[metaWONDERverse] Welcome to metaWONDERverse",
  forgotPassword: "[metaWONDERverse] Reset Password",
  changePassword: "[metaWONDERverse] Password Updated",
  socialSignup: "[metaWONDERverse] Welcome to metaWONDERverse",
};

const emailTempl = {
  Destination: {
    ToAddresses: [],
  },
  Message: {
    Body: {
      Html: {
        Charset: "UTF-8",
        Data: "",
      },
      Text: {
        Charset: "UTF-8",
        Data: "This is the message body in text format.",
      },
    },
    Subject: {
      Charset: "UTF-8",
      Data: "",
    },
  },
  ReplyToAddresses: ["YOUR_EMAIL_ADDRESS"],
  Source: "YOUR_EMAIL_ADDRESS",
};

const mailMergeMap = (params: IMailParams): { [key: string]: string } => {
  return {
    email: params.email,
    password: params?.password ?? "",
  };
};

function mailMerge(html: string, data: IMailParams) {
  Object.keys(mailMergeMap(data)).forEach((key) => {
    let searchkey = "${" + key + "}";
    while (html.indexOf(searchkey) > 0) {
      html = html.replace(searchkey, mailMergeMap(data)[key]);
    }
  });
  return html;
}

function getEmailParams(template: EEmailTemplate, toUser: string, content: IContent | null) {
  const data = { email: toUser, ...content };
  const _emTmpl = JSON.parse(JSON.stringify(emailTempl));
  _emTmpl.Message.Body.Html.Data = mailMerge(emailBody[template], data);
  _emTmpl.Message.Subject.Data = subject[template];
  _emTmpl.Destination.ToAddresses.push(toUser);
  return _emTmpl;
}

export const sendEmail = (template: EEmailTemplate, toUser: string, content: IContent | null) => {
  const params = getEmailParams(template, toUser, content);
  return new Promise((resolve, reject) => {
    ses.sendEmail(params, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

export const sendOTPEmail = (toUser: string, password: string) => {
  return sendEmail(EEmailTemplate.OTP, toUser, { password });
};

export const sendForgotPasswordEmail = (toUser: string, password: string) => {
  return sendEmail(EEmailTemplate.FORGOT_PASSWORD, toUser, { password });
};

export const sendChangePasswordEmail = (toUser: string) => {
  return sendEmail(EEmailTemplate.CHANGE_PASSWORD, toUser, null);
};

export const sendSocialSignupEmail = (toUser: string) => {
  return sendEmail(EEmailTemplate.SOCIAL_SIGNUP, toUser, null);
};
