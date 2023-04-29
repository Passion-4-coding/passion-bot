const SWEAR_WORD_REGEX = /(?<=^|[^а-яa-z])(([уyu]|[нзnz3][аa]|(хитро|не)?[вvwb][зz3]?[ыьъi]|[сsc][ьъ']|(и|[рpr][аa4])[зсzs]ъ?|([оo0][тбtb6]|[пp][оo0][дd9])[ьъ']?|(.\B)+?[оаеиeo])?-?([еёe][бb6](?!о[рй])|и[пб][ае][тц]).*?|([нn][иеаaie]|([дпdp]|[вv][еe3][рpr][тt])[оo0]|[рpr][аa][зсzc3]|[з3z]?[аa]|с(ме)?|[оo0]([тt]|дно)?|апч)?-?[хxh][уuy]([яйиеёюuie]|ли(?!ган)).*?|([вvw][зы3z]|(три|два|четыре)жды|(н|[сc][уuy][кk])[аa])?-?[бb6][лl]([яy](?!(х|ш[кн]|мб)[ауеыио]).*?|[еэe][дтdt][ь']?)|([рp][аa][сзc3z]|[знzn][аa]|[соsc]|[вv][ыi]?|[пp]([еe][рpr][еe]|[рrp][оиioеe]|[оo0][дd])|и[зс]ъ?|[аоao][тt])?[пpn][иеёieu][зz3][дd9].*?|([зz3][аa])?[пp][иеieu][дd][аоеaoe]?[рrp](ну.*?|[оаoa][мm]|([аa][сcs])?([иiu]([лl][иiu])?[нщктлtlsn]ь?)?|([оo](ч[еиei])?|[аa][сcs])?[кk]([оo]й)?|[юu][гg])[ауеыauyei]?|[мm][аa][нnh][дd]([ауеыayueiи]([лl]([иi][сзc3щ])?[ауеыauyei])?|[оo][йi]|[аоao][вvwb][оo](ш|sh)[ь']?([e]?[кk][ауеayue])?|юк(ов|[ауи])?)|[мm][уuy][дd6]([яyаиоaiuo0].*?|[еe]?[нhn]([ьюия'uiya]|ей))|мля([тд]ь)?|лять|([нз]а|по)х|м[ао]л[ао]фь([яию]|[её]й))(?=($|[^а-я]))/gm;
const { EmbedBuilder } = require("discord.js");
const NodeCache = require( "node-cache" );
const memberMessagesCache = new NodeCache( { stdTTL: 600 } );

const getSwearWordAmount = (message) => {
  let amount = 0;
  let lastIndex = null;
  SWEAR_WORD_REGEX.lastIndex = 0;
  while ((m = SWEAR_WORD_REGEX.exec(message.toLowerCase())) !== null) {
    if (m.index === SWEAR_WORD_REGEX.lastIndex) {
      SWEAR_WORD_REGEX.lastIndex++;
    }
    m.forEach((match) => {
      if (match && (lastIndex === null || lastIndex !== SWEAR_WORD_REGEX.lastIndex)) {
        lastIndex = SWEAR_WORD_REGEX.lastIndex;
        amount += 1;
      }
    });
  }
  return amount;
}

const checkSwearWordsForUser = (amount, member, channel) => {
  const userCache = memberMessagesCache.get(member.user.id);
  const totalAmount = userCache && userCache.swearWordsAmount ? amount + userCache.swearWordsAmount : amount;
  memberMessagesCache.set(member.user.id, { ...userCache, swearWordsAmount: totalAmount });
  if (totalAmount >= 3) {
    const seconds = 60 * 1000;
    const minutes = totalAmount * 20;
    const muteTime = minutes * seconds
    member.timeout(muteTime);
    const embed = new EmbedBuilder().setTitle(`User has been muted`).setDescription(`${member.user.username} has been muted for ${minutes} minutes for using swear words. Please keep a positive atmosphere of communication. If you feel the mute is unfair feel free to contact administrator.`);
    channel.send({ embeds: [embed] });
  }
}



module.exports = {
  getSwearWordAmount,
  checkSwearWordsForUser
}