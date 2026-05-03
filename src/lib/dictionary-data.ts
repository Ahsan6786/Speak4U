export interface DictionaryWord {
  id: string;
  word: string;
  hinglish: string;
  meaning: string;
  usage: string;
  example: string;
  category: "Daily" | "Professional" | "Emotional" | "Social";
}

export const DICTIONARY_DATA: DictionaryWord[] = [
  {
    id: "1",
    word: "Essentially",
    hinglish: "Matlab ki basically",
    meaning: "Used to emphasize the basic, fundamental, or most important nature of something.",
    usage: "Jab aap kisi baat ka main point batana chahte ho.",
    example: "Essentially, we need to focus on our communication skills.",
    category: "Daily"
  },
  {
    id: "2",
    word: "Perspective",
    hinglish: "Nazariya / Point of view",
    meaning: "A particular attitude toward or way regarding something; a point of view.",
    usage: "Jab aap apna ya kisi aur ka sochne ka tareeka batate ho.",
    example: "From my perspective, this plan is perfect.",
    category: "Daily"
  },
  {
    id: "3",
    word: "Consistent",
    hinglish: "Lagaatar / Ek jaisa",
    meaning: "Acting or done in the same way over time, especially so as to be fair or accurate.",
    usage: "Jab aap kisi ki regular mehnat ki baat karte ho.",
    example: "You need to be consistent with your practice.",
    category: "Daily"
  },
  {
    id: "4",
    word: "Articulate",
    hinglish: "Saaf saaf bolna",
    meaning: "Having or showing the ability to speak fluently and coherently.",
    usage: "Jab koi apni baat bahut acche se samjha paaye.",
    example: "She is very articulate when she explains complex ideas.",
    category: "Professional"
  },
  {
    id: "5",
    word: "Paradigm Shift",
    hinglish: "Soch mein bada badlav",
    meaning: "A fundamental change in approach or underlying assumptions.",
    usage: "Jab kisi cheez ko dekhne ka pura tareeka hi badal jaaye.",
    example: "The internet caused a paradigm shift in how we shop.",
    category: "Professional"
  },
  {
    id: "6",
    word: "Empathetic",
    hinglish: "Dusro ki feeling samajhne wala",
    meaning: "Showing an ability to understand and share the feelings of another.",
    usage: "Jab aap kisi ke dukh ya situation ko mehsoos karte ho.",
    example: "A good leader is always empathetic towards their team.",
    category: "Social"
  },
  {
    id: "7",
    word: "Ambiguous",
    hinglish: "Gol-mol / Clear na hona",
    meaning: "Open to more than one interpretation; not having one obvious meaning.",
    usage: "Jab koi baat saaf na ho aur confusion paida kare.",
    example: "His reply was very ambiguous, I don't know if he said yes or no.",
    category: "Daily"
  },
  {
    id: "8",
    word: "Reluctant",
    hinglish: "Hichkichana / Maan na hona",
    meaning: "Unwilling and hesitant; disinclined.",
    usage: "Jab aapka koi kaam karne ka mann na ho.",
    example: "He was reluctant to share his secret with anyone.",
    category: "Emotional"
  },
  {
    id: "9",
    word: "Spontaneous",
    hinglish: "Achanak / Bina planning ke",
    meaning: "Performed or occurring as a result of a sudden impulse or inclination and without premeditation.",
    usage: "Jab aap bina soche samjhe turant kuch karte ho.",
    example: "We took a spontaneous trip to the mountains.",
    category: "Social"
  },
  {
    id: "10",
    word: "Vulnerable",
    hinglish: "Kamzor / Emotional mode mein",
    meaning: "Exposed to the possibility of being attacked or harmed, either physically or emotionally.",
    usage: "Jab aap apne emotions khul kar dikhate ho aur thoda dar lagta hai.",
    example: "It's okay to feel vulnerable sometimes.",
    category: "Emotional"
  },
  {
    id: "11",
    word: "Incentive",
    hinglish: "Fayda / Lalach (Positive way)",
    meaning: "A thing that motivates or encourages someone to do something.",
    usage: "Jab aapko kuch karne ke liye koi reward mile.",
    example: "The bonus was a great incentive for the employees.",
    category: "Professional"
  },
  {
    id: "12",
    word: "Nuance",
    hinglish: "Baareeki / Chota sa antar",
    meaning: "A subtle difference in or shade of meaning, expression, or sound.",
    usage: "Jab do cheezon mein bahut chota magar important farq ho.",
    example: "You need to understand the nuances of this language.",
    category: "Daily"
  },
  {
    id: "13",
    word: "Authentic",
    hinglish: "Asli / Genuine",
    meaning: "Of undisputed origin; genuine.",
    usage: "Jab koi cheez ya insaan bilkul real ho.",
    example: "Always try to be your authentic self.",
    category: "Social"
  },
  {
    id: "14",
    word: "Leverage",
    hinglish: "Fayda uthana / Use karna",
    meaning: "Use (something) to maximum advantage.",
    usage: "Jab aap apni skills ya resources ka pura use karte ho.",
    example: "We can leverage our network to grow the business.",
    category: "Professional"
  },
  {
    id: "15",
    word: "Pragmatic",
    hinglish: "Practical / Samajhdar",
    meaning: "Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.",
    usage: "Jab aap emotions ke bajaye reality ke basis pe decision lete ho.",
    example: "We need a pragmatic solution to this problem.",
    category: "Daily"
  },
  {
    id: "16",
    word: "Compromise",
    hinglish: "Samjhouta",
    meaning: "An agreement or a settlement of a dispute that is reached by each side making concessions.",
    usage: "Jab do log beech ka rasta nikaalte hain.",
    example: "In any relationship, you have to compromise sometimes.",
    category: "Social"
  },
  {
    id: "17",
    word: "Redundant",
    hinglish: "Faltu / Jiski zaroorat na ho",
    meaning: "Not or no longer needed or useful; superfluous.",
    usage: "Jab koi cheez baar-baar repeat ho rahi ho aur extra lage.",
    example: "That sentence is redundant, you can remove it.",
    category: "Daily"
  },
  {
    id: "18",
    word: "Resilient",
    hinglish: "Majboot / Haar na maanne wala",
    meaning: "(Of a person or animal) able to withstand or recover quickly from difficult conditions.",
    usage: "Jab koi mushkil waqt se jaldi bahar nikal aaye.",
    example: "Children are often more resilient than adults.",
    category: "Emotional"
  },
  {
    id: "19",
    word: "Skeptic",
    hinglish: "Shakki / Jaldi yakeen na karne wala",
    meaning: "A person inclined to question or doubt all accepted opinions.",
    usage: "Jab aap kisi cheez pe jaldi bharosa nahi karte.",
    example: "I'm a bit of a skeptic when it comes to new apps.",
    category: "Daily"
  },
  {
    id: "20",
    word: "Ubiquitous",
    hinglish: "Har jagah milne wala",
    meaning: "Present, appearing, or found everywhere.",
    usage: "Jab koi cheez itni common ho ki har jagah dikhe.",
    example: "Smartphones are ubiquitous these days.",
    category: "Daily"
  },
  {
    id: "21",
    word: "Accomplish",
    hinglish: "Poora karna / Haasil karna",
    meaning: "To achieve or complete something successfully.",
    usage: "Jab aap koi target ya task poora kar lete ho.",
    example: "I want to accomplish my goals by the end of this year.",
    category: "Professional"
  },
  {
    id: "22",
    word: "Appreciate",
    hinglish: "Tareef karna / Kadar karna",
    meaning: "To recognize the full worth of something or someone.",
    usage: "Jab aap kisi ki mehnat ya help ki respect karte ho.",
    example: "I really appreciate your help with this project.",
    category: "Social"
  },
  {
    id: "23",
    word: "Bizarre",
    hinglish: "Ajeeb / Shocking",
    meaning: "Very strange or unusual.",
    usage: "Jab koi cheez itni ajeeb ho ki yakeen na aaye.",
    example: "That was a bizarre situation, I've never seen anything like it.",
    category: "Daily"
  },
  {
    id: "24",
    word: "Collaborate",
    hinglish: "Mil kar kaam karna",
    meaning: "To work jointly on an activity or project.",
    usage: "Jab do ya do se zyada log ek saath kaam karte hain.",
    example: "Let's collaborate on this new marketing strategy.",
    category: "Professional"
  },
  {
    id: "25",
    word: "Compassion",
    hinglish: "Daya / Reham",
    meaning: "Sympathetic pity and concern for the sufferings or misfortunes of others.",
    usage: "Jab aap kisi ke liye dil mein narmi mehsoos karte ho.",
    example: "We should show more compassion towards the homeless.",
    category: "Emotional"
  },
  {
    id: "26",
    word: "Diligence",
    hinglish: "Mehnat / Lagan",
    meaning: "Careful and persistent work or effort.",
    usage: "Jab aap kisi kaam ko bahut dhyan aur mehnat se karte ho.",
    example: "Her diligence paid off when she got promoted.",
    category: "Professional"
  },
  {
    id: "27",
    word: "Eloquent",
    hinglish: "Accha bolne wala / Asardaar",
    meaning: "Fluent or persuasive in speaking or writing.",
    usage: "Jab koi apni baat itne acche se kahe ki sunne wala impress ho jaye.",
    example: "His speech was very eloquent and moving.",
    category: "Professional"
  },
  {
    id: "28",
    word: "Exaggerate",
    hinglish: "Badha-chadhakar bolna",
    meaning: "Represent (something) as being better or worse than it really is.",
    usage: "Jab koi baat ko mirch-masala laga kar bataye.",
    example: "Don't exaggerate the problem, it's not that big of a deal.",
    category: "Daily"
  },
  {
    id: "29",
    word: "Fascinating",
    hinglish: "Bahut dilchasp / Mazedar",
    meaning: "Extremely interesting.",
    usage: "Jab koi cheez aapka poora dhyan kheench le.",
    example: "Space travel is a fascinating subject.",
    category: "Daily"
  },
  {
    id: "30",
    word: "Genuine",
    hinglish: "Asli / Sacha",
    meaning: "Truly what something is said to be; authentic.",
    usage: "Jab koi cheez ya insaan bilkul real aur imandaar ho.",
    example: "He showed genuine concern for my health.",
    category: "Social"
  },
  {
    id: "31",
    word: "Humble",
    hinglish: "Down to earth / Shareef",
    meaning: "Having or showing a modest or low estimate of one's importance.",
    usage: "Jab koi bada aadmi hone ke baad bhi ghamand na kare.",
    example: "Despite his success, he remains very humble.",
    category: "Social"
  },
  {
    id: "32",
    word: "Inevitable",
    hinglish: "Jo hokar rahega / Pakka",
    meaning: "Certain to happen; unavoidable.",
    usage: "Jab koi aisi baat ho jise koi rok nahi sakta.",
    example: "Change is inevitable in life.",
    category: "Daily"
  },
  {
    id: "33",
    word: "Innovative",
    hinglish: "Naya aur alag / Creative",
    meaning: "Featuring new methods; advanced and original.",
    usage: "Jab koi purane kaam ko naye aur behtar tareeke se kare.",
    example: "The company is known for its innovative products.",
    category: "Professional"
  },
  {
    id: "34",
    word: "Justify",
    hinglish: "Sahi thehrana / Saboot dena",
    meaning: "Show or prove to be right or reasonable.",
    usage: "Jab aap apni kisi baat ya action ka reason dete ho.",
    example: "How do you justify spending so much money?",
    category: "Daily"
  },
  {
    id: "35",
    word: "Kindle",
    hinglish: "Jagana / Roshni dikhana",
    meaning: "Light or set on fire; arouse or inspire (an emotion or feeling).",
    usage: "Jab aap kisi ke dil mein koi ummeed ya feeling jagate ho.",
    example: "The teacher's words kindled a love for science in her.",
    category: "Emotional"
  },
  {
    id: "36",
    word: "Lethargic",
    hinglish: "Sust / Thaka hua",
    meaning: "Affected by lethargy; sluggish and apathetic.",
    usage: "Jab aapka kisi kaam mein mann na lage aur neend aaye.",
    example: "I felt very lethargic after that heavy meal.",
    category: "Daily"
  },
  {
    id: "37",
    word: "Meticulous",
    hinglish: "Baareeki se kaam karne wala",
    meaning: "Showing great attention to detail; very careful and precise.",
    usage: "Jab koi har choti cheez ka dhyan rakhe.",
    example: "He is meticulous about keeping his room clean.",
    category: "Daily"
  },
  {
    id: "38",
    word: "Navigate",
    hinglish: "Rasta nikaalna / Handle karna",
    meaning: "Plan and direct the route or course of a ship, aircraft, or other form of transport; find one's way through a process.",
    usage: "Jab aap kisi mushkil raste ya situation se bahar nikalte ho.",
    example: "It's difficult to navigate through these complex rules.",
    category: "Professional"
  },
  {
    id: "39",
    word: "Obsession",
    hinglish: "Junoon / Pagalpan",
    meaning: "An idea or thought that continually preoccupies or intrudes on a person's mind.",
    usage: "Jab aap kisi cheez ke peeche haath dho kar pad jayein.",
    example: "His obsession with fitness is starting to affect his health.",
    category: "Emotional"
  },
  {
    id: "40",
    word: "Pessimistic",
    hinglish: "Niraashawaadi / Negative sochne wala",
    meaning: "Tending to see the worst aspect of things or believe that the worst will happen.",
    usage: "Jab koi hamesha bura hone ka darr rakhe.",
    example: "Don't be so pessimistic, everything will be fine.",
    category: "Emotional"
  },
  {
    id: "41",
    word: "Quaint",
    hinglish: "Purana aur sundar",
    meaning: "Attractively unusual or old-fashioned.",
    usage: "Jab koi purani cheez ya jagah bahut pyaari lage.",
    example: "The village had many quaint little shops.",
    category: "Daily"
  },
  {
    id: "42",
    word: "Relentless",
    hinglish: "Be-reham / Bina ruke",
    meaning: "Oppressively constant; incessant.",
    usage: "Jab koi bina thake kisi cheez ke peeche pada rahe.",
    example: "His relentless pursuit of success paid off.",
    category: "Daily"
  },
  {
    id: "43",
    word: "Serendipity",
    hinglish: "Kismat se milna / Accha ittefaq",
    meaning: "The occurrence and development of events by chance in a happy or beneficial way.",
    usage: "Jab koi acchi cheez achanak aur bina plan kiye ho jaye.",
    example: "Meeting my best friend was pure serendipity.",
    category: "Social"
  },
  {
    id: "44",
    word: "Transparent",
    hinglish: "Saaf-suthra / Khula",
    meaning: "(Of a material or article) allowing light to pass through so that objects behind can be distinctly seen; easy to perceive or detect.",
    usage: "Jab koi baat ya process bilkul saaf ho aur koi raaz na ho.",
    example: "The selection process needs to be more transparent.",
    category: "Professional"
  },
  {
    id: "45",
    word: "Unanimous",
    hinglish: "Ek mat / Sabki razamandi",
    meaning: "(Of two or more people) fully in agreement.",
    usage: "Jab sab log ek hi baat pe agree karein.",
    example: "The decision was unanimous among the committee members.",
    category: "Professional"
  },
  {
    id: "46",
    word: "Vague",
    hinglish: "Dhundhla / Gol-mol",
    meaning: "Of uncertain, indefinite, or unclear character or meaning.",
    usage: "Jab koi baat clear na ho aur samajh na aaye.",
    example: "His description of the person was very vague.",
    category: "Daily"
  },
  {
    id: "47",
    word: "Whimsical",
    hinglish: "Manmauji / Funny",
    meaning: "Playfully quaint or fanciful, especially in an appealing and amusing way.",
    usage: "Jab koi apni marzi se maze-maze mein kuch kare.",
    example: "She has a whimsical sense of humor.",
    category: "Social"
  },
  {
    id: "48",
    word: "Xenophobia",
    hinglish: "Anjanon se darr / Bahaar walon se nafrat",
    meaning: "Dislike of or prejudice against people from other countries.",
    usage: "Jab koi doosre desh ya culture ke logon ko pasand na kare.",
    example: "We must work together to eliminate xenophobia.",
    category: "Social"
  },
  {
    id: "49",
    word: "Yield",
    hinglish: "Paida karna / Haar maanna",
    meaning: "Produce or provide (a natural, agricultural, or industrial product); give way to arguments, demands, or pressure.",
    usage: "Jab aap koi result dete ho ya kisi ke aage jhukte ho.",
    example: "This investment will yield great returns in the future.",
    category: "Professional"
  },
  {
    id: "50",
    word: "Zeal",
    hinglish: "Josh / Jazba",
    meaning: "Great energy or enthusiasm in pursuit of a cause or an objective.",
    usage: "Jab aap kisi kaam ko poore josh ke saath karte ho.",
    example: "He worked with great zeal to finish the project.",
    category: "Emotional"
  },
  {
    id: "51",
    word: "Aesthetic",
    hinglish: "Sundar / Look wise accha",
    meaning: "Concerned with beauty or the appreciation of beauty.",
    usage: "Jab koi cheez dekhne mein bahut classy aur pyaari ho.",
    example: "I really like the aesthetic of your new office.",
    category: "Daily"
  },
  {
    id: "52",
    word: "Banter",
    hinglish: "Hansi-mazak / Ched-chad",
    meaning: "The playful and friendly exchange of teasing remarks.",
    usage: "Jab doston mein halka-phulka mazaak chale.",
    example: "I enjoy the friendly banter between my colleagues.",
    category: "Social"
  },
  {
    id: "53",
    word: "Chronicle",
    hinglish: "Silsile-war likhna / Itihas",
    meaning: "A factual written account of important or historical events in the order of their occurrence.",
    usage: "Jab kisi cheez ki history ko step-by-step bataya jaye.",
    example: "The book chronicles the rise of the startup.",
    category: "Professional"
  },
  {
    id: "54",
    word: "Debunk",
    hinglish: "Jhoot pakadna / Sach dikhana",
    meaning: "Expose the falseness or hollowness of (a myth, idea, or belief).",
    usage: "Jab aap kisi galat fehmi ya afwah ka parda-faash karte ho.",
    example: "Scientists have debunked the myth about this medicine.",
    category: "Daily"
  },
  {
    id: "55",
    word: "Empathy",
    hinglish: "Humdardi / Feel karna",
    meaning: "The ability to understand and share the feelings of another.",
    usage: "Jab aap doosre ki takleef ko khud mehsoos kar paate ho.",
    example: "Empathy is a key trait for any counselor.",
    category: "Emotional"
  },
  {
    id: "56",
    word: "Formidable",
    hinglish: "Khaufnaak / Majboot",
    meaning: "Inspiring fear or respect through being impressively large, powerful, intense, or capable.",
    usage: "Jab koi cheez ya insaan itna bada ho ki thoda darr ya respect aaye.",
    example: "He is a formidable opponent on the tennis court.",
    category: "Daily"
  },
  {
    id: "57",
    word: "Gullible",
    hinglish: "Bhol-bhala / Jaldi baaton mein aane wala",
    meaning: "Easily persuaded to believe something; credulous.",
    usage: "Jab koi itna seedha ho ki koi bhi use ullu bana sake.",
    example: "She is too gullible and believes everything people say.",
    category: "Social"
  },
  {
    id: "58",
    word: "Hindsight",
    hinglish: "Baad mein samajhna / Piche dekhna",
    meaning: "Understanding of a situation or event only after it has happened or developed.",
    usage: "Jab koi kaam hone ke baad aapko samajh aaye ki kya hona chahiye tha.",
    example: "In hindsight, I should have taken that job offer.",
    category: "Daily"
  },
  {
    id: "59",
    word: "Immaculate",
    hinglish: "Ek dum saaf / Bina galti ke",
    meaning: "Perfectly clean, neat, or tidy; free from flaws or mistakes.",
    usage: "Jab koi cheez bilkul chamchamati aur perfect ho.",
    example: "The house was in immaculate condition.",
    category: "Daily"
  },
  {
    id: "60",
    word: "Jargon",
    hinglish: "Kaam ki technical bhasha",
    meaning: "Special words or expressions that are used by a particular profession or group and are difficult for others to understand.",
    usage: "Jab kisi field ke log aisi terms use karein jo normal logon ko na pata ho.",
    example: "Try to explain the concept without using too much legal jargon.",
    category: "Professional"
  },
  {
    id: "61",
    word: "Kindred",
    hinglish: "Ek jaisa / Rishtedar",
    meaning: "One's family and relations; similar in kind; related.",
    usage: "Jab aapko koi aisa mile jiske thoughts aapke jaise ho (Kindred Spirits).",
    example: "I felt a kindred connection with her immediately.",
    category: "Social"
  },
  {
    id: "62",
    word: "Luminous",
    hinglish: "Chamkila / Roshni wala",
    meaning: "Full of or shedding light; bright or shining, especially in the dark.",
    usage: "Jab koi cheez andhere mein chamke ya bahut bright ho.",
    example: "The moon looked luminous in the clear night sky.",
    category: "Daily"
  },
  {
    id: "63",
    word: "Malaise",
    hinglish: "Bechaini / Sustiyat",
    meaning: "A general feeling of discomfort, illness, or uneasiness whose exact cause is difficult to identify.",
    usage: "Jab aapko andar se thoda bura lage magar samajh na aaye kyu.",
    example: "A sense of malaise spread through the company after the layoff.",
    category: "Emotional"
  },
  {
    id: "64",
    word: "Nostalgia",
    hinglish: "Purani yaadein / Beete din",
    meaning: "A sentimental longing or wistful affection for the past, typically for a period or place with happy personal associations.",
    usage: "Jab aap purane dinon ko yaad karke thoda emotional ho jayein.",
    example: "Seeing the old photo filled me with nostalgia.",
    category: "Emotional"
  },
  {
    id: "65",
    word: "Obsolete",
    hinglish: "Purana / Jo ab use nahi hota",
    meaning: "No longer produced or used; out of date.",
    usage: "Jab koi technology ya cheez bekar ho jaye kyunki naya aa gaya hai.",
    example: "Typewriters have become obsolete.",
    category: "Daily"
  },
  {
    id: "66",
    word: "Paradox",
    hinglish: "Ulta-pulta / Ajab-gajab",
    meaning: "A seemingly absurd or self-contradictory statement or proposition that when investigated or explained may prove to be well founded or true.",
    usage: "Jab koi aisi baat ho jo dekhne mein galat lage magar sach ho.",
    example: "It's a paradox that the more you give, the more you have.",
    category: "Daily"
  },
  {
    id: "67",
    word: "Quash",
    hinglish: "Kuchalna / Khatam karna",
    meaning: "Reject or void, especially by legal procedure; put an end to; suppress.",
    usage: "Jab aap kisi afwah ya koshish ko turant khatam kar dete ho.",
    example: "The government moved quickly to quash the rumors.",
    category: "Professional"
  },
  {
    id: "68",
    word: "Reverie",
    hinglish: "Khayali pulav / Sapnon mein hona",
    meaning: "A state of being pleasantly lost in one's thoughts; a daydream.",
    usage: "Jab aap kaam karte-karte achanak kisi khayal mein kho jayein.",
    example: "He was shaken out of his reverie by the loud noise.",
    category: "Emotional"
  },
  {
    id: "69",
    word: "Skeptical",
    hinglish: "Shakki / Bharosa na karne wala",
    meaning: "Not easily convinced; having doubts or reservations.",
    usage: "Jab aap kisi ki baat pe jaldi yakin nahi karte.",
    example: "I'm skeptical about his claims of making quick money.",
    category: "Daily"
  },
  {
    id: "70",
    word: "Trivial",
    hinglish: "Choti baat / Maamuli",
    meaning: "Of little value or importance.",
    usage: "Jab koi cheez itni choti ho ki dhyan dene ki zaroorat na ho.",
    example: "Don't waste your time on trivial matters.",
    category: "Daily"
  },
  {
    id: "71",
    word: "Undermine",
    hinglish: "Kamzor karna / Niche dikhana",
    meaning: "Lessen the effectiveness, power, or ability of, especially gradually or insidiously.",
    usage: "Jab aap kisi ki image ya confidence ko dhire-dhire kam karte ho.",
    example: "Constant criticism can undermine a person's confidence.",
    category: "Professional"
  },
  {
    id: "72",
    word: "Validate",
    hinglish: "Sahi thehrana / Confirm karna",
    meaning: "Check or prove the validity or accuracy of (something).",
    usage: "Jab aap kisi ki baat ya feeling ko correct maante ho.",
    example: "I just wanted to validate my feelings with you.",
    category: "Emotional"
  },
  {
    id: "73",
    word: "Wary",
    hinglish: "Sawdhan / Chaukanna",
    meaning: "Feeling or showing caution about possible dangers or problems.",
    usage: "Jab aap kisi cheez ya insaan ko lekar cautious raho.",
    example: "Be wary of strangers offering free gifts.",
    category: "Social"
  },
  {
    id: "74",
    word: "Yearn",
    hinglish: "Tadapna / Intense chah",
    meaning: "Have an intense feeling of longing for something, typically something that one has lost or been separated from.",
    usage: "Jab aap kisi cheez ko dil se bahut zyada chahte ho.",
    example: "He yearned for his home in the village.",
    category: "Emotional"
  },
  {
    id: "75",
    word: "Zenith",
    hinglish: "Bulandi / Shikhar",
    meaning: "The time at which something is most powerful or successful.",
    usage: "Jab koi apne career ya success ke top pe ho.",
    example: "He reached the zenith of his career at the age of thirty.",
    category: "Professional"
  },
  {
    id: "76",
    word: "Appease",
    hinglish: "Khush karna / Shanti banana",
    meaning: "Pacify or placate (someone) by acceding to their demands.",
    usage: "Jab aap kisi gusse wale ko shaant karne ke liye uski baat maan lo.",
    example: "They tried to appease the angry customers with refunds.",
    category: "Social"
  },
  {
    id: "77",
    word: "Benevolent",
    hinglish: "Dayalu / Bhala karne wala",
    meaning: "Well meaning and kindly.",
    usage: "Jab koi bina kisi swarth ke doosron ki madad kare.",
    example: "A benevolent donor gave money to the orphanage.",
    category: "Social"
  },
  {
    id: "78",
    word: "Candid",
    hinglish: "Saaf-dil / Khula",
    meaning: "Truthful and straightforward; frank.",
    usage: "Jab koi bina kisi filter ke sach-sach bol de.",
    example: "I appreciate your candid feedback on my work.",
    category: "Professional"
  },
  {
    id: "79",
    word: "Devout",
    hinglish: "Kattar / Poora bhakt",
    meaning: "Having or showing deep religious feeling or commitment.",
    usage: "Jab koi apne dharam ya kisi cheez ke liye poori tarah dedicated ho.",
    example: "She is a devout follower of yoga.",
    category: "Emotional"
  },
  {
    id: "80",
    word: "Enigma",
    hinglish: "Paheli / Jo samajh na aaye",
    meaning: "A person or thing that is mysterious, puzzling, or difficult to understand.",
    usage: "Jab koi aisi cheez ho jo bahut mysterious lage.",
    example: "His silence remains an enigma to all of us.",
    category: "Daily"
  },
  {
    id: "81",
    word: "Frugal",
    hinglish: "Kanjoos / Soch-samajh ke kharchne wala",
    meaning: "Sparing or economical with regard to money or food.",
    usage: "Jab koi paise bachane ke liye dhyan se kharch kare.",
    example: "He is very frugal and never wastes a penny.",
    category: "Daily"
  },
  {
    id: "82",
    word: "Giddy",
    hinglish: "Pagalpan / Chakkar aana",
    meaning: "Having a sensation of whirling and a tendency to fall or stagger; dizzy; excited.",
    usage: "Jab aap khushi ke maare thode bawle ho jayein.",
    example: "She felt giddy with excitement when she won.",
    category: "Emotional"
  },
  {
    id: "83",
    word: "Hapless",
    hinglish: "Bechara / Badnaseeb",
    meaning: "(Especially of a person) unfortunate.",
    usage: "Jab kisi ke saath hamesha bura hi hota rahe.",
    example: "The hapless passengers were stranded at the airport.",
    category: "Social"
  },
  {
    id: "84",
    word: "Iconic",
    hinglish: "Mashoor / Legendary",
    meaning: "Relating to or of the nature of an icon; widely recognized and well-established.",
    usage: "Jab koi cheez itni famous ho ki log use pehchanne lagein.",
    example: "The Taj Mahal is an iconic building.",
    category: "Daily"
  },
  {
    id: "85",
    word: "Judicious",
    hinglish: "Samajhdar / Dhyan se",
    meaning: "Having, showing, or done with good judgment or sense.",
    usage: "Jab koi decision bahut soch-samajh ke liya jaye.",
    example: "We should make judicious use of our resources.",
    category: "Professional"
  },
  {
    id: "86",
    word: "Knack",
    hinglish: "Hunar / Tareeka",
    meaning: "An acquired or natural skill at performing a task.",
    usage: "Jab aapke paas kisi kaam ko karne ka special talent ho.",
    example: "She has a knack for making people feel comfortable.",
    category: "Social"
  },
  {
    id: "87",
    word: "Loathe",
    hinglish: "Nafrat karna / Gheen aana",
    meaning: "Feel intense dislike or disgust for.",
    usage: "Jab aap kisi cheez ko bilkul bardasht na kar sakein.",
    example: "I loathe people who lie.",
    category: "Emotional"
  },
  {
    id: "88",
    word: "Moderate",
    hinglish: "Beech ka / Na zyada na kam",
    meaning: "Average in amount, intensity, quality, or degree.",
    usage: "Jab koi cheez bilkul balance mein ho.",
    example: "Moderate exercise is good for your health.",
    category: "Daily"
  },
  {
    id: "89",
    word: "Nimble",
    hinglish: "Furtila / Tez",
    meaning: "Quick and light in movement or action; agile.",
    usage: "Jab koi physical ya mentally bahut fast ho.",
    example: "His nimble fingers moved quickly over the keyboard.",
    category: "Daily"
  },
  {
    id: "90",
    word: "Ominous",
    hinglish: "Ashubh / Bura hone ka sanket",
    meaning: "Giving the impression that something bad or unpleasant is going to happen; threatening.",
    usage: "Jab andhere badal ya koi situation bura sign de.",
    example: "Those black clouds look very ominous.",
    category: "Daily"
  },
  {
    id: "91",
    word: "Passive",
    hinglish: "Dheel / Jo active na ho",
    meaning: "Accepting or allowing what happens or what others do, without active response or resistance.",
    usage: "Jab koi bina kisi reaction ke sab hone de.",
    example: "Don't be a passive observer, take part in the discussion.",
    category: "Professional"
  },
  {
    id: "92",
    word: "Quip",
    hinglish: "Mazaakiya jawab / Chutkula",
    meaning: "A witty remark.",
    usage: "Jab koi turant koi mazedar aur intelligent baat kahe.",
    example: "He always has a clever quip for every situation.",
    category: "Social"
  },
  {
    id: "93",
    word: "Radiant",
    hinglish: "Chamkta hua / Khush",
    meaning: "Sending out light; shining or glowing brightly.",
    usage: "Jab koi khushi ke maare chamak raha ho.",
    example: "She looked radiant on her wedding day.",
    category: "Emotional"
  },
  {
    id: "94",
    word: "Scrupulous",
    hinglish: "Imandaar / Baareeki se",
    meaning: "(Of a person or process) diligent, thorough, and extremely attentive to details; very concerned to avoid doing wrong.",
    usage: "Jab koi kaam poori imandari aur detail ke saath kare.",
    example: "He was scrupulous in his bookkeeping.",
    category: "Professional"
  },
  {
    id: "95",
    word: "Tenacious",
    hinglish: "Ziddi (Positive) / Pakka",
    meaning: "Tending to keep a firm hold of something; clinging or adhering closely; persistent.",
    usage: "Jab koi apne goals ko lekar bahut ziddi aur dedicated ho.",
    example: "She is a tenacious climber who never gives up.",
    category: "Emotional"
  },
  {
    id: "96",
    word: "Uncanny",
    hinglish: "Ajeeb / Hairat-angez",
    meaning: "Strange or mysterious, especially in an unsettling way.",
    usage: "Jab koi cheez itni accurate ho ki darr lagne lage.",
    example: "He has an uncanny ability to predict the future.",
    category: "Daily"
  },
  {
    id: "97",
    word: "Versatile",
    hinglish: "Multitalented / Har-fann-maula",
    meaning: "Able to adapt or be adapted to many different functions or activities.",
    usage: "Jab koi insaan ya cheez bahut saare alag-alag kaam kar sake.",
    example: "He is a versatile actor who can play any role.",
    category: "Professional"
  },
  {
    id: "98",
    word: "Witty",
    hinglish: "Hazir-jawab / Mazedar",
    meaning: "Showing or characterized by quick and inventive verbal humor.",
    usage: "Jab koi bahut fast aur funny reply de.",
    example: "His witty comments kept everyone entertained.",
    category: "Social"
  },
  {
    id: "99",
    word: "Yielding",
    hinglish: "Lachila / Jhukne wala",
    meaning: "(Of a substance) giving way under pressure; compliant.",
    usage: "Jab koi situation ke hisab se maan jaye.",
    example: "The ground was soft and yielding under our feet.",
    category: "Daily"
  },
  {
    id: "100",
    word: "Zealous",
    hinglish: "Joshiyla / Jazbe wala",
    meaning: "Having or showing zeal.",
    usage: "Jab aap kisi cause ke liye bahut zyada enthusiastic ho.",
    example: "He is a zealous supporter of animal rights.",
    category: "Social"
  },
  {
    id: "101",
    word: "Adversity",
    hinglish: "Mushkil waqt / Museebat",
    meaning: "Difficulties; misfortune.",
    usage: "Jab aap kisi bade challenge ya dukh se guzar rahe ho.",
    example: "Strong people are built through adversity.",
    category: "Emotional"
  },
  {
    id: "102",
    word: "Blunder",
    hinglish: "Badi galti / Bhool",
    meaning: "A stupid or careless mistake.",
    usage: "Jab aap bina soche samjhe koi aisi galti kar do jo bhari pade.",
    example: "Sending that email to the whole company was a huge blunder.",
    category: "Professional"
  },
  {
    id: "103",
    word: "Coherence",
    hinglish: "Baat ka tal-mel / Clear connection",
    meaning: "The quality of being logical and consistent.",
    usage: "Jab aapki baatein ek doosre se judi ho aur samajh aaye.",
    example: "Your essay lacks coherence, it's jumping from topic to topic.",
    category: "Professional"
  },
  {
    id: "104",
    word: "Discrepancy",
    hinglish: "Farq / Gadbad",
    meaning: "A lack of compatibility or similarity between two or more facts.",
    usage: "Jab do baaton ya figures mein koi antar ho jo nahi hona chahiye.",
    example: "There is a discrepancy between the two bank statements.",
    category: "Professional"
  },
  {
    id: "105",
    word: "Exasperated",
    hinglish: "Bahut zyada chidha hua / Pareshan",
    meaning: "Intensely irritated and frustrated.",
    usage: "Jab aap kisi cheez se itne pareshan ho jayein ki gussa aane lage.",
    example: "She gave an exasperated sigh when the computer crashed again.",
    category: "Emotional"
  }
];
