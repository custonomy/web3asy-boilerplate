import fs from "fs";
import AWS from "aws-sdk";

// Set the region
const region = process.env.AWSREGION || "ap-southeast-1";
AWS.config.update({ region });

const ses = new AWS.SES();
// AWS.SES();
/* The following example sends a formatted email: */
const emailBody: any = {
  otp: fs.readFileSync(__dirname + "/../../emailtemplate/otp.html").toString(),
  forgotPassword: fs.readFileSync(__dirname + "/../../emailtemplate/forgotpw.html").toString(),
  changePassword: fs.readFileSync(__dirname + "/../../emailtemplate/changepw.html").toString(),
  socialSignup: fs.readFileSync(__dirname + "/../../emailtemplate/socialsignup.html").toString(),
};

const subject: any = {
  otp: "[metaWONDERverse] Welcome to metaWONDERverse",
  forgotPassword: "[metaWONDERverse] Reset Password",
  changePassword: "[metaWONDERverse] Password Updated",
  socialSignup: "[metaWONDERverse] Welcome to metaWONDERverse",
};

const emailTempl: any = {
  Destination: {
    ToAddresses: [],
  },
  Message: {
    Body: {
      Html: {
        Charset: "UTF-8",
        //    Data: "This message body contains HTML formatting. It can, for example, contain links like this one: <a class=\"ulink\" href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" target=\"_blank\">Amazon SES Developer Guide</a>."
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
  ReplyToAddresses: ["service@custonomy.io"],
  // ReturnPath: "",
  // ReturnPathArn: "",
  Source: "service@custonomy.io",
  // SourceArn: ""
};

export const EMAIL_TEMPLATE = {
  OTP: "otp",
  FORGOT_PW: "forgotPassword",
  CHANGE_PW: "changePassword",
  SOCIAL_SIGNUP: "socialSignup",
};

const MAIL_MERGE_MAP: any = (params: any) => {
  return {
    email: params.email,
    password: params.password,
  };
};

/**
 *
 * @param {string} html
 * @param {*} data
 * @returns
 */
function mailMerge(html: string, data: {}) {
  // console.log('>>>', typeof html);
  // html = html.toString();
  Object.keys(MAIL_MERGE_MAP(data)).forEach((key) => {
    // html = html.replace(/[${' + key + '}']/g, MAIL_MERGE_MAP(data)[key]);
    // console.log({key, value: MAIL_MERGE_MAP(data)[key]})
    let searchkey = "${" + key + "}";
    while (html.indexOf(searchkey) > 0) {
      html = html.replace(searchkey, MAIL_MERGE_MAP(data)[key]);
    }
  });
  return html;
}

function getEmailParams(template: string | number, toUser: string, content: any | null, header = "https://api.custonomy.io:8000") {
  switch (template) {
    case EMAIL_TEMPLATE.OTP:
    case EMAIL_TEMPLATE.CHANGE_PW:
    case EMAIL_TEMPLATE.FORGOT_PW:
    case EMAIL_TEMPLATE.SOCIAL_SIGNUP:
      let data = {  };
      Object.assign(data, { email: toUser });
      if (content) Object.assign(data, content);
      const _emTmpl = JSON.parse(JSON.stringify(emailTempl));
      
      _emTmpl.Message.Body.Html.Data = mailMerge(emailBody[template], data);
      _emTmpl.Message.Subject.Data = subject[template];
      _emTmpl.Destination.ToAddresses.push(toUser);
      
      return _emTmpl;
      break;
  }
}

export function sendEmail(template: string, toUser: string, content: { password?: any; antiPhishingCode?: string } | null, header = "https://api.custonomy.io:8000") {
  const params = getEmailParams(template, toUser, content, header);
console.log({toUser})

  return new Promise((resolve, reject) => {
    ses.sendEmail(params, function (err, data) {
      console.log(err, data);
      // if (err) console.log(err, err.stack); // an error occurred
      // else     console.log(data);           // successful response
      if (err) reject(err);
      else resolve(data);
      /* data = {
                MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
            } */
    });
  });
}

export function sendOTPEmail(toUser: string, password: any, header: string) {
  return sendEmail(EMAIL_TEMPLATE.OTP, toUser, { password }, header);
}

export function sendForgotPasswordEmail(toUser: string, password: any, header: string) {
  return sendEmail(EMAIL_TEMPLATE.FORGOT_PW, toUser, { password }, header);
}

export function sendChangePasswordEmail(toUser: string, header: string) {
  return sendEmail(EMAIL_TEMPLATE.CHANGE_PW, toUser, null, header);
}

export function sendSocialSignupEmail(toUser: string, header: string) {
  return sendEmail(EMAIL_TEMPLATE.SOCIAL_SIGNUP, toUser, null, header);
}
