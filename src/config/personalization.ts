/**
 * SINGLE PERSONALIZATION CONFIGURATION FILE
 * -----------------------------------------
 * Edit the values below to customize the entire experience for your sister.
 * No invented memories, names, or events are hardcoded inside components.
 */

export interface MemoryPlaceholder {
  id: string;
  title: string;
  caption: string;
  dateLabel: string;
  /** Optional path to a real screenshot/photo in /public/memories/ (leave empty to show a cute polaroid placeholder) */
  imagePath?: string;
}

export interface SurpriseConfig {
  sisterNickname: string;
  brotherName: string;
  brotherSignature: string;
  audioFilePath: string;
  audioTrackTitle: string;
  audioTrackArtist: string;
  /** Duration in seconds for the built-in playful fallback track if sister-song.mp3 has not been added yet */
  fallbackTrackDurationSec: number;
  certificateDate: string;
  gameWinningScore: number;
  gameDurationSeconds: number;
  entrance: {
    heading: string;
    subtitle: string;
    ctaLabel: string;
    heroImage: string;
  };
  loadingMessages: string[];
  prank: {
    heading: string;
    subtitle: string;
    albumCover: string;
    playbackMessages: string[];
    escapeMessages: string[];
    apologyFirstLine: string;
    apologySecondLine: string;
  };
  letter: {
    envelopePrompt: string;
    openButtonLabel: string;
    salutation: string;
    paragraphs: string[];
    signOff: string;
    nextButtonLabel: string;
    memoriesSectionHeading: string;
    memories: MemoryPlaceholder[];
  };
  barbieContract: {
    heading: string;
    intro: string;
    emblemImage: string;
    terms: string[];
    disclaimer: string;
    acceptButtonLabel: string;
  };
  game: {
    title: string;
    intro: string;
    victoryHeading: string;
    victorySubheading: string;
  };
  certificate: {
    title: string;
    subtitle: string;
    closingNote: string;
    overallMessage: string;
    treatyLine: string;
  };
}

export const SURPRISE_CONFIG: SurpriseConfig = {
  // Personalization placeholders — replace these with your real nicknames and date!
  sisterNickname: 'Velvet',
  brotherName: 'Saahil',
  brotherSignature: '— Your Annoying Brother, Saahil',
  audioFilePath: '/audio/sister-song.mp3',
  audioTrackTitle: 'The only concert i Enjoy',
  audioTrackArtist: 'The World Famous Singer',
  fallbackTrackDurationSec: 24,
  certificateDate: '24/11/26',
  gameWinningScore: 10,
  gameDurationSeconds: 60,

  entrance: {
    heading: 'I know tum abhi bhi gussa ho 🤧',
    subtitle:
      "Isiliye maine socha ki kuch toh banata hu toh raat ke 4.45 i mean subha ke 4.45 baje mai banaraha hu kuch toh hope tumhe pasand aye",
    ctaLabel: 'Open your surprise ♡',
    heroImage: '/src/assets/images/Ebichu.jpeg',
  },

  loadingMessages: [
    'Preparing something special...',
    'Removing unnecessary overthinking...',
    "Loading your brother's questionable creativity...",
    'Almost there, behenaaa 🤧...',
  ],

  prank: {
    heading: 'Bahahahaha kitna cute gana gati hoo',
    subtitle: 'Performed by the one and only, my extremely talented Pyali ben <3',
    albumCover: '/src/assets/images/nikochansing.jpeg',
    playbackMessages: [
      '😭 i know u hate this song',
      'la la la la la la la la la la la la la',
      'Auto-tune could never match your voice, behenaaa',
      'Me is enjoying your concert for suureeeee.',
      'Honestly? Top 1 on my playlist forever.',
    ],
    escapeMessages: [
      'Chalna itna easy thodi hai band karna',
      'pura suno chup chap its cutee',
      'haww meri behen ki avaj kaise ni pasand tumhe kahi tum koi aur toh nhi ? ',
      'Bauni ho na isiliy nhi kr parahi skip </3',
      'koina ab last option hai sun lo ',
    ],
    apologyFirstLine: 'Okay okay... enough bullying. 😭',
    apologySecondLine: "Sorry, my bad. Here's what I actually made for you.",
  },

  letter: {
    envelopePrompt: 'Someone has a little something to tell you...',
    openButtonLabel: 'Open your letter 💌',
    salutation: 'Dear Velvet,',
    paragraphs: [
      "okay so idk velvet i know i always get angry and then tumpe nikal deta hu but i really dont want to do it i just sometimes do it coz i am dumb i will try no to do it ik i have promised before to but still ended up doing that but for now i will actually try not to hurt your feelings that way coz i know ur my pyali behenaa ",
      "ik i say hurtful stuff when i am mad and i obviouslyy  know that ur definitely feel the sameway i do and i do notice your efforts too but idk why i kindoff too you for granted today not just today but like most of the time and i am feeling really guilty know and i am really sorry for being selfish and not thinging about your pov and i will try to be more mature in this thing form now on ",
      "idk i why i am crying while writing this part too but ur actually my favorite behen in this whole world and i am really dump to push u to your limits till u have to say things which hurt me too but ig that what sibling fights are ment its ok we do mistake and then we appologize and try to improve and thats what i will try to doo aswell please just dont giveup on me that easily and dont leave me alonge bakaaa  i miss my pyali ben aise bhagke mt jana kahi gadhi ",
      "From now on i will try to improve and tell u stuff directly ha directy bura laga toh lagne do teko koi bat ni but i will do it bhale hi vo kitna hi stupid kyu na sound kare but i wil tell you how i feel exactly coz u do the same i just felt as a big brother its my responsiblity to be there for your but completly forgot that u care for me too and i just ignored all your feelings and idk i am sorry for that velvet teko pata hai mai bhondu hu haina? galti karta rehta hu meko samjadia karo ",
      "i legit felt soo bad today that u came to talk to me and i was contantly pushing you away and taunting u and saying rude stuff but i am not used to this type of behaviour i am usually just left alone to suffer and whenever someone tries to do something for me i just feel i dont deserve all this and try to push everyone away its not just u everyone i just wanna be alone but now i know i dont need to be alone i have my sister whos there for me too cheer me up and i will always remember that thing from now on",
      "Thank You Soooooooo Muccchhhh velvet for being there for me i love u soo muchh behenaaa u dont know how lucky i am to have u as my sister without you i would be constantly overthining whole night alone but i have u who keeps me distracted from everything ",
    ],
    signOff: 'Always your annoying brother,\nSaahil 💗',
    nextButtonLabel: "But you will have to earn it click me ",
    memoriesSectionHeading: 'jyada sad sad na ho isiliye yeh dekh lena ',
    memories: [
      {
        id: 'memory-1',
        title: 'Ik teko yeh pfp match karni thi ',
        caption: 'Lets do this pfp match when i come back to discord which i am going to obvio cant leave dc ',
        dateLabel: '',
        imagePath: '/src/assets/images/pfpmatch.jpeg',
      },
      {
        id: 'memory-2',
        title: 'i hope yeh teko hasade thodusa',
        caption: 'but i still wonder kya hunzula ki lulli sacchi mai choti hogi hmmm puchna padega usse ',
        dateLabel: '[Insert Date]',
        imagePath: '/src/assets/images/hunzula.png',
      },
    ],
  },

  barbieContract: {
    heading: 'THE OFFICIAL BARBIE CONTRACT 💅',
    intro:
      'I, the annoying brother, hereby officially agree to watch the entire Barbie movie collection with my sister.',
    emblemImage: '/src/assets/images/barbie.jpeg',
    terms: [
      'No complaints.',
      'No cheating.',
      'No fake sleeping.',
      'No escaping halfway through.',
      'No making excuses.',
      'She gets to choose the movies.',
    ],
    disclaimer:
      'Please note: This agreement is legally binding under the Sister-Brother Treaty of 2026.',
    acceptButtonLabel: 'Accept & Catch the Teddy Bears 🧸',
  },

  game: {
    title: 'Catch the Teddy Bears! 🧸',
    intro:
      "Your next mission is very important. Collect the teddy bears to prove that I deserve punishment ",
    victoryHeading: 'Hawww tum jitt gayiii 😭',
    victorySubheading: 'Nahiiii ab meko barbie ki movie dekhni padegii ahhhhhhhhhhhhhhhhhhhhhhh',
  },

  certificate: {
    title: 'OFFICIAL BARBIE WATCHING AGREEMENT',
    subtitle:
      'Congratulations! You have successfully forced your brother into the Barbie universe.',
    closingNote:
      "Koina velvet itni punnishment toh mai jhel hi sakta hu 😭💗",
    overallMessage:
      "You are my sister, your are gay , you are bhondu and someone I'm genuinely grateful to have in my life.",
    treatyLine: 'Sealed under the Sister-Brother Treaty of 2026',
  },
};
