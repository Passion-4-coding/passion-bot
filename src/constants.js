const IS_PRODUCTION = process.env.PRODUCTION;

// ROLES
const TRAINEE_ROLE = IS_PRODUCTION ? "850393978926006294" : "1076550893647962193";
const JUNIOR_ROLE = IS_PRODUCTION ? "850394388513423360" : "1113387344498798612";
const MIDDLE_ROLE = IS_PRODUCTION ? "850394587896741939" : "1113387404745773066";
const SENIOR_ROLE = IS_PRODUCTION ? "850396433600872518" : "1113387442771337266";
const PRINCIPAL_ROLE = IS_PRODUCTION ? "850396643911532554" : "1113391768021516318";
const LEAD_ROLE = IS_PRODUCTION ? "1146069924045926471" : "1146188339783938110";
const ARCHITECT_ROLE = IS_PRODUCTION ? "982605844015357982" : "1113545609094385694";
const QA_ROLE = IS_PRODUCTION ? "850396748001706024" : "1113545672784879737";
const OWNER_ROLE = IS_PRODUCTION ? "850397549324140575" : "1113545573115646023";
const UA_ROLE = IS_PRODUCTION ? "1081158202193891358" : "1081211658204106832";
const EN_ROLE = IS_PRODUCTION ? "1081163687731134514" : "1081211770762440724";
const RU_ROLE = IS_PRODUCTION ? "1081159521482850346" : "1081211731608612965";

// CHANNELS
const RECEPTION_CHANNEL = IS_PRODUCTION ? "876024439245000746" : "1081864082912706573";
const COFFEE_CHANNEL = IS_PRODUCTION ? "821695511768727569" : "1073690832600842252";
const BOT_CHANNEL = IS_PRODUCTION ? "1073513189922328576" : "1101542345700286567";
const CODE_CHANNEL = IS_PRODUCTION ? "821695511768727567" : "1118064704821137448";
const DRAFT_CHANNEL = IS_PRODUCTION ? "1119175434899296287" : "1119933699396485120";
const DRAFT_REVIEW_CHANNEL = IS_PRODUCTION ? "1119933370013589594" : "1119933729603846194";
const KARMA_CHANNEL = IS_PRODUCTION ? "1133074006308827278" : "1133074115742416946";

const ROLES_KARMA_GRADATION = {
  junior: 50,
  middle: 500,
  senior: 1000,
  principal: 5000,
  lead: 50000
}

// COLORS
const PRIMARY_COLOR = "#6764E9";
const DANGER_COLOR = "#DC2626";

// IMAGES
const KARMA_10 = "https://res.cloudinary.com/de76u6w6i/image/upload/v1689436870/15_wujd67.png";
const KARMA_15 = "https://res.cloudinary.com/de76u6w6i/image/upload/v1689436870/27_aeunua.png";
const KARMA_20 = "https://res.cloudinary.com/de76u6w6i/image/upload/v1688030691/16_krfted.png";
const KARMA_30 = "https://res.cloudinary.com/de76u6w6i/image/upload/v1688030691/19_n32exh.png";
const KARMA_40 = "https://res.cloudinary.com/de76u6w6i/image/upload/v1689436870/18_z9dnpd.png";
const KARMA_45 = "https://res.cloudinary.com/de76u6w6i/image/upload/v1689436870/26_pybdme.png";
const KARMA_50 = "https://res.cloudinary.com/de76u6w6i/image/upload/v1689436870/24_d2kzoe.png";
const KARMA_60 = "https://res.cloudinary.com/de76u6w6i/image/upload/v1689436870/17_vlz1vx.png";
const KARMA_75 = "https://res.cloudinary.com/de76u6w6i/image/upload/v1689436870/25_op45cg.png";
const KARMA_LEADERS_24H = "https://res.cloudinary.com/de76u6w6i/image/upload/v1689430114/13_qlwfh9.png";
const STATS_24H = "https://res.cloudinary.com/de76u6w6i/image/upload/v1689430114/12_uogafz.png";
const QUIZ_LEADERS_WEEK = "https://res.cloudinary.com/de76u6w6i/image/upload/v1689430114/21_zqndjv.png";
const CONTENT_CONTRIBUTORS_WEEK = "https://res.cloudinary.com/de76u6w6i/image/upload/v1689430114/22_cuc1qn.png";

// ADMIN

const ADMIN_ID = "746469708554829845";

module.exports = {
  roles: {
    trainee: TRAINEE_ROLE,
    junior: JUNIOR_ROLE,
    middle: MIDDLE_ROLE,
    senior: SENIOR_ROLE,
    principal: PRINCIPAL_ROLE,
    lead: LEAD_ROLE,
    architect: ARCHITECT_ROLE,
    qa: QA_ROLE,
    owner: OWNER_ROLE,
    ua: UA_ROLE,
    en: EN_ROLE,
    ru: RU_ROLE
  },
  karmaGradation: ROLES_KARMA_GRADATION,
  languages: ["ua", "en"],
  progressRoles: [
    { id: TRAINEE_ROLE, name: "trainee" },
    { id: JUNIOR_ROLE, name: "junior" },
    { id: MIDDLE_ROLE, name: "middle" },
    { id: SENIOR_ROLE, name: "senior" },
    { id: PRINCIPAL_ROLE, name: "principal" },
    { id: LEAD_ROLE, name: "lead" },
    { id: ARCHITECT_ROLE, name: "architect" },
    { id: QA_ROLE, name: "qa" },
    { id: OWNER_ROLE, name: "owner" },
  ],
  defaultLanguage: "en",
  channels: {
    reception: RECEPTION_CHANNEL,
    coffee: COFFEE_CHANNEL,
    code: CODE_CHANNEL,
    bot: BOT_CHANNEL,
    draft: DRAFT_CHANNEL,
    draft_review: DRAFT_REVIEW_CHANNEL,
    karma: KARMA_CHANNEL
  },
  colors: {
    primary: PRIMARY_COLOR,
    danger: DANGER_COLOR
  },
  images: {
    karmaLeaders: KARMA_LEADERS_24H,
    stats: STATS_24H,
    quizLeaders: QUIZ_LEADERS_WEEK,
    contentLeaders: CONTENT_CONTRIBUTORS_WEEK,
    karma10: KARMA_10,
    karma15: KARMA_15,
    karma20: KARMA_20,
    karma30: KARMA_30,
    karma40: KARMA_40,
    karma45: KARMA_45,
    karma50: KARMA_50,
    karma60: KARMA_60,
    karma75: KARMA_75
  },
  adminId: ADMIN_ID
}