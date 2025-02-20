import { Belt } from './belt';
import { Technique } from './technique';

export const SyllabusMap: {
  WHITE: {
    kihon: ({ id: string; name: string } | { id: string; name: string })[];
    kata: { id: string; name: string }[];
    kumite: { id: string; name: string }[]
  };
  YELLOW: {
    kihon: ({ id: string; name: string } | { id: string; name: string })[];
    kata: { id: string; name: string }[];
    kumite: { id: string; name: string }[]
  };
  ORANGE: {
    kihon: ({ id: string; name: string } | { id: string; name: string })[];
    kata: { id: string; name: string }[];
    kumite: { id: string; name: string }[]
  };
  GREEN: {
    kihon: ({ id: string; name: string } | { id: string; name: string })[];
    kata: { id: string; name: string }[];
    kumite: { id: string; name: string }[]
  };
  BLUE: {
    kihon: ({ id: string; name: string } | { id: string; name: string })[];
    kata: { id: string; name: string }[];
    kumite: { id: string; name: string }[]
  };
  RED: {
    kihon: ({ id: string; name: string } | { id: string; name: string })[];
    kata: { id: string; name: string }[];
    kumite: { id: string; name: string }[]
  };
  BROWN: {
    kihon: ({ id: string; name: string } | { id: string; name: string })[];
    kata: { id: string; name: string }[];
    kumite: { id: string; name: string }[]
  };
  BLACK: {
    kihon: ({ id: string; name: string } | { id: string; name: string })[];
    kata: { id: string; name: string }[];
    kumite: { id: string; name: string }[]
  }
} = {
  WHITE: {
    kihon: [
      { id: 'kihon-1', name: 'Oi Zuki (Lunge Punch)' },
      { id: 'kihon-2', name: 'Age Uke (Rising Block)' }
    ],
    kata: [
      { id: 'kata-1', name: 'Taikyoku Shodan' }
    ],
    kumite: [
      { id: 'kumite-1', name: 'Basic One-Step Sparring' }
    ]
  },
  YELLOW: {
    kihon: [
      { id: 'kihon-3', name: 'Gyaku Zuki (Reverse Punch)' },
      { id: 'kihon-4', name: 'Soto Uke (Outer Block)' }
    ],
    kata: [
      { id: 'kata-2', name: 'Heian Shodan' }
    ],
    kumite: [
      { id: 'kumite-2', name: 'Intermediate One-Step Sparring' }
    ]
  },
  ORANGE: {
    kihon: [
      { id: 'kihon-5', name: 'Uchi Uke (Inner Block)' },
      { id: 'kihon-6', name: 'Mae Geri (Front Kick)' }
    ],
    kata: [
      { id: 'kata-3', name: 'Heian Nidan' }
    ],
    kumite: [
      { id: 'kumite-3', name: 'Advanced One-Step Sparring' }
    ]
  },
  GREEN: {
    kihon: [
      { id: 'kihon-7', name: 'Yoko Geri (Side Kick)' },
      { id: 'kihon-8', name: 'Shuto Uke (Knifehand Block)' }
    ],
    kata: [
      { id: 'kata-4', name: 'Heian Sandan' }
    ],
    kumite: [
      { id: 'kumite-4', name: 'Free Sparring Drills' }
    ]
  },
  BLUE: {
    kihon: [
      { id: 'kihon-9', name: 'Mawashi Geri (Roundhouse Kick)' },
      { id: 'kihon-10', name: 'Hiza Geri (Knee Strike)' }
    ],
    kata: [
      { id: 'kata-5', name: 'Heian Yondan' }
    ],
    kumite: [
      { id: 'kumite-5', name: 'Counterattack Drills' }
    ]
  },
  RED: {
    kihon: [
      { id: 'kihon-11', name: 'Ushiro Geri (Back Kick)' },
      { id: 'kihon-12', name: 'Empi Uchi (Elbow Strike)' }
    ],
    kata: [
      { id: 'kata-6', name: 'Heian Godan' }
    ],
    kumite: [
      { id: 'kumite-6', name: 'Intermediate Free Sparring' }
    ]
  },
  BROWN: {
    kihon: [
      { id: 'kihon-13', name: 'Tetsui Uchi (Hammer Fist)' },
      { id: 'kihon-14', name: 'Kakato Geri (Axe Kick)' }
    ],
    kata: [
      { id: 'kata-7', name: 'Tekki Shodan' }
    ],
    kumite: [
      { id: 'kumite-7', name: 'Advanced Free Sparring' }
    ]
  },
  BLACK: {
    kihon: [
      { id: 'kihon-15', name: 'Ura Mawashi Geri (Hook Kick)' },
      { id: 'kihon-16', name: 'Tobi Geri (Jump Kick)' }
    ],
    kata: [
      { id: 'kata-8', name: 'Bassai Dai' }
    ],
    kumite: [
      { id: 'kumite-8', name: 'Tournament Sparring' }
    ]
  }
};
