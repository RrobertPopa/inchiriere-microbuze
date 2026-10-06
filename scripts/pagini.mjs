/**
 * Paginile de serviciu — o căutare principală pe o adresă (os/capabilities/seo/02-cuvinte.md).
 * Harta de cuvinte și de unde vin: ~/.claude/os/projects/web-dev/inchiriere-microbuze/seo.md
 *
 * REGULĂ: aici intră doar ce e adevărat. Afirmațiile vin din ce scrie deja pe site (aprobat de Robert)
 * — flota, șoferul, „preț fix spus înainte”, serviciile din „Unde mergem”. Orașul de bază și prețurile
 * NU sunt aici până nu le confirmă tatăl lui Robert (vezi ORAS mai jos).
 */

export const SITE = 'https://inchiriere-microbuze.ro';

// Orașul din care pleacă mașinile. null = nu apare nicăieri. Când e confirmat (ex. 'București'),
// intră automat în titluri, descrieri și JSON-LD.
export const ORAS = null;

const dinOras = ORAS ? ` din ${ORAS}` : '';
const inOras = ORAS ? ` ${ORAS}` : '';

/* Fiecare pagină:
   slug        adresa (fără slash la final)
   titlu       <title>, ≤ 60 caractere, începe cu căutarea
   descriere   meta description, 70–160 caractere
   scop        ce se scrie în mesajul de WhatsApp
   eticheta    linia mică de deasupra H1
   h1          căutarea principală, spusă natural
   lead        primul paragraf: răspunde direct
   masina      'sprinter' | 'trafic' | 'ambele' — ce mașină recomandăm
   blocuri     [{ titlu, text | lista }]
   intrebari   [{ q, a }] — FAQ, apare și ca FAQPage în JSON-LD
*/
export const PAGINI = [
  {
    slug: 'mercedes-sprinter-20-locuri',
    titlu: 'Închiriere microbuz 20 locuri cu șofer | Mercedes Sprinter',
    descriere: 'Mercedes Sprinter până la 20+1 locuri, cu șofer inclus și compartiment separat pentru bagaje. Pentru circuite, nunți și deplasări de grup. Preț fix.',
    scop: 'Mercedes Sprinter, până la 20+1 locuri',
    eticheta: 'Flota · Mercedes-Benz Sprinter',
    h1: 'Microbuz de 20 de locuri, cu șofer',
    lead: 'Mercedes-Benz Sprinter duce până la 20 de pasageri, plus șoferul. Tot grupul stă în aceeași mașină, iar bagajele merg în compartimentul din spate, separat de scaune.',
    masina: 'sprinter',
    blocuri: [
      { titlu: 'Pentru ce grupuri e', lista: [
        'Circuite de mai multe zile prin România, cu bagaje pentru fiecare.',
        'Nunți și evenimente: aducem invitații și îi ducem acasă, câte curse e nevoie.',
        'Echipe sportive și deplasări de firmă.',
        'Curse în Europa, cu același șofer dus și întors.'
      ] },
      { titlu: 'Ce are mașina', lista: [
        'Până la 20 de pasageri + șofer.',
        'Compartiment separat pentru bagaje, în spate.',
        'Aer condiționat.',
        'Ușă glisantă și treaptă la urcare.'
      ] },
      { titlu: 'De ce vine cu șofer', text: 'Un microbuz cu mai mult de opt pasageri se conduce doar cu permis de categoria D1 sau D. Nu trebuie să-l aibă nimeni din grup: la volan stă un om de-al nostru, care vine la adresa voastră și rămâne cu grupul până la întoarcere.' }
    ],
    intrebari: [
      { q: 'Câți oameni încap într-un Mercedes Sprinter?', a: 'Până la 20 de pasageri, plus șoferul. Configurația exactă a mașinii o confirmăm odată cu oferta.' },
      { q: 'Pot închiria Sprinterul fără șofer?', a: 'Nu. Închiriem doar cu șofer inclus. Pentru mai mult de opt pasageri e nevoie de permis D1 sau D, așa că șoferul vine de la noi.' },
      { q: 'Suntem mai mult de 20. Ce facem?', a: 'Sunați-ne și vedem ce mașini sunt libere pentru data voastră.' },
      { q: 'Cum se stabilește prețul?', a: 'După traseu, număr de zile și mașină. Primiți un preț fix înainte de plecare și nu apare nimic în plus pe parcurs.' }
    ]
  },
  {
    slug: 'renault-trafic-8-1',
    titlu: 'Închiriere microbuz 8+1 cu șofer | Renault Trafic',
    descriere: 'Renault Trafic 8+1 locuri cu șofer: pentru transfer la aeroport, familie mare sau grup mic. Loc de bagaje pentru toți opt. Preț fix, spus înainte.',
    scop: 'Renault Trafic, 8+1 locuri',
    eticheta: 'Flota · Renault Trafic',
    h1: 'Microbuz 8+1 locuri, cu șofer',
    lead: 'Renault Trafic e microbuzul pentru opt pasageri. Intră ușor pe străzile înguste și are loc de bagaje pentru toți opt, în spatele ultimului rând.',
    masina: 'trafic',
    blocuri: [
      { titlu: 'Pentru ce drumuri e', lista: [
        'Transfer la aeroport, cu bagajele tuturor.',
        'O familie mare sau un grup de prieteni.',
        'City break sau un weekend la munte.'
      ] },
      { titlu: 'Ce are mașina', lista: [
        '8 pasageri + șofer.',
        'Bagaje în spatele ultimului rând.',
        'Aer condiționat.',
        'Versiunea pentru pasageri, cu geamuri pe toată lungimea.'
      ] },
      { titlu: 'Șoferul e inclus', text: 'Nu conduce nimeni din grup. Șoferul vine la adresă înainte de ora stabilită, conduce tot drumul și, la aeroport, urmărește zborul: dacă aterizați mai târziu, vă așteaptă el pe voi.' }
    ],
    intrebari: [
      { q: 'Câți pasageri încap într-un Renault Trafic?', a: 'Opt pasageri, plus șoferul.' },
      { q: 'Suntem 9 sau mai mulți. Ce mașină ne trebuie?', a: 'Mercedes Sprinter, care duce până la 20 de pasageri. Vedeți pagina despre Sprinter sau cereți ofertă și vă recomandăm noi mașina.' },
      { q: 'Care e diferența față de Mercedes Vito?', a: 'Amândouă duc opt pasageri, cu șofer. Dacă aveți o preferință, scrieți-o în cerere; altfel vă recomandăm mașina liberă la data voastră.' },
      { q: 'Pot închiria Traficul fără șofer?', a: 'Nu, doar cu șofer inclus.' }
    ]
  },
  {
    slug: 'mercedes-vito-8-1',
    titlu: 'Închiriere Mercedes Vito 8+1 cu șofer',
    descriere: 'Mercedes Vito pentru 8 pasageri, cu șofer inclus: transfer la aeroport, deplasări de firmă și drumuri lungi. Bagaje pentru toți opt. Preț fix.',
    scop: 'Mercedes Vito, 8+1 locuri',
    eticheta: 'Flota · Mercedes-Benz Vito',
    h1: 'Mercedes Vito 8+1, cu șofer',
    lead: 'Mercedes-Benz Vito duce opt pasageri, plus șoferul. E alegerea pentru un grup mic care vrea confortul unui Mercedes: la aeroport, la o întâlnire de afaceri sau pe un drum lung.',
    masina: 'vito',
    blocuri: [
      { titlu: 'Pentru ce drumuri e', lista: [
        'Transfer la aeroport, cu bagajele tuturor.',
        'Deplasări de firmă și oaspeți de la aeroport la hotel.',
        'O familie mare sau un grup de prieteni la drum lung.'
      ] },
      { titlu: 'Ce are mașina', lista: [
        '8 pasageri + șofer.',
        'Bagaje în spatele ultimului rând.',
        'Aer condiționat.',
        'Versiunea pentru pasageri, cu geamuri pe toată lungimea.'
      ] },
      { titlu: 'Vito sau Trafic?', text: 'Amândouă duc opt pasageri. Vito e alegerea când contează imaginea, de exemplu oaspeți de firmă; Traficul e la fel de încăpător. Dacă aveți o preferință, scrieți-o în cerere; dacă nu, vă recomandăm noi mașina liberă la data voastră.' }
    ],
    intrebari: [
      { q: 'Câți pasageri încap într-un Mercedes Vito?', a: 'Opt pasageri, plus șoferul. Configurația exactă a mașinii o confirmăm odată cu oferta.' },
      { q: 'Pot închiria Vito fără șofer?', a: 'Nu, doar cu șofer inclus.' },
      { q: 'Suntem mai mult de 8. Ce mașină ne trebuie?', a: 'Mercedes Sprinter, care duce până la 20 de pasageri.' }
    ]
  },
  {
    slug: 'transfer-aeroport-otopeni',
    titlu: 'Transfer aeroport Otopeni cu microbuz și șofer',
    descriere: 'Transfer la aeroportul Otopeni sau Băneasa cu Mercedes Vito, Renault Trafic 8+1 sau Sprinter 20+1, cu loc pentru bagaje. Șoferul urmărește zborul.',
    scop: 'transfer aeroport',
    eticheta: 'Transfer aeroport',
    h1: 'Transfer la aeroportul Otopeni, cu microbuz',
    lead: 'Vă luăm de la adresă și vă ducem la Otopeni, Băneasa sau orice alt aeroport, cu loc pentru toate bagajele. La întoarcere, șoferul urmărește zborul: dacă aterizați mai târziu, vă așteaptă el pe voi.',
    masina: 'ambele',
    blocuri: [
      { titlu: 'Ce mașină vă trebuie', lista: [
        'Până la 8 persoane: Renault Trafic sau Mercedes Vito, 8+1, cu bagajele în spatele ultimului rând.',
        'Între 9 și 20 de persoane: Mercedes Sprinter, cu compartiment separat pentru bagaje.'
      ] },
      { titlu: 'Cum decurge', lista: [
        'Ne spuneți zborul, adresa și câți sunteți.',
        'Primiți mașina potrivită și un preț fix.',
        'Șoferul ajunge la adresă înainte de ora stabilită. La sosire, vă așteaptă la aeroport.'
      ] }
    ],
    intrebari: [
      { q: 'Ce se întâmplă dacă zborul întârzie?', a: 'Șoferul urmărește zborul și vă așteaptă. Nu trebuie să ne anunțați voi.' },
      { q: 'Faceți transfer și la Băneasa sau la alt aeroport?', a: 'Da: Otopeni, Băneasa sau orice alt aeroport.' },
      { q: 'Avem multe bagaje. Încap?', a: 'La Trafic, bagajele stau în spatele ultimului rând; la Sprinter, într-un compartiment separat. Spuneți-ne câte bagaje mari aveți și vă recomandăm mașina.' }
    ]
  },
  {
    slug: 'transport-nunta',
    titlu: 'Transport invitați nuntă cu microbuz și șofer',
    descriere: 'Microbuz cu șofer pentru nunți și evenimente: aducem invitații și îi ducem acasă, câte curse e nevoie. Sprinter 20+1 sau Trafic 8+1, preț fix.',
    scop: 'nuntă / eveniment',
    eticheta: 'Nunți și evenimente',
    h1: 'Transport pentru invitații de la nuntă',
    lead: 'Aducem invitații la cununie, la biserică și la restaurant, apoi îi ducem acasă la final, câte curse e nevoie. Nimeni nu conduce după petrecere și nimeni nu caută loc de parcare.',
    masina: 'ambele',
    blocuri: [
      { titlu: 'Ce rezolvă', lista: [
        'Invitații din alt oraș ajung împreună, la timp.',
        'Drumul între cununie, biserică și restaurant, fără mașini răsfirate.',
        'La final, toată lumea ajunge acasă cu șofer, nu la volan.'
      ] },
      { titlu: 'Mașinile', lista: [
        'Mercedes Sprinter, până la 20 de pasageri.',
        'Renault Trafic sau Mercedes Vito, 8 pasageri, pentru familia apropiată sau nași.'
      ] },
      { titlu: 'Ce ne trimiteți pentru ofertă', text: 'Data, adresele (de unde luăm invitații, unde e evenimentul), câți sunt și la ce oră se termină. Primiți un preț fix pentru toate cursele.' }
    ],
    intrebari: [
      { q: 'Puteți face mai multe curse în aceeași seară?', a: 'Da, câte curse e nevoie: aducem invitații și îi ducem acasă.' },
      { q: 'Cât de devreme trebuie să rezerv?', a: 'Cât mai devreme, mai ales în sezonul de nunți. Scrieți-ne data și verificăm ce mașini sunt libere.' }
    ]
  },
  {
    slug: 'transport-angajati',
    titlu: 'Transport angajați cu microbuz | contract și factură',
    descriere: 'Transport angajați cu microbuz și șofer, pe program fix, cu contract și factură. Mercedes Sprinter până la 20+1, Mercedes Vito și Renault Trafic 8+1.',
    scop: 'transport angajați',
    eticheta: 'Transport angajați',
    h1: 'Transport angajați, pe program fix',
    lead: 'Curse pe program fix pentru firme: același traseu, aceleași ore, cu contract și factură. Oamenii ajung împreună la tură și pleacă împreună acasă.',
    masina: 'ambele',
    blocuri: [
      { titlu: 'Cum lucrăm cu firmele', lista: [
        'Stabilim traseul, punctele de îmbarcare și orele.',
        'Alegem mașina după câți oameni sunt pe tură: Trafic sau Vito 8+1, ori Sprinter până la 20+1.',
        'Lucrăm cu contract și factură.'
      ] },
      { titlu: 'Și pentru o singură deplasare', text: 'Pe lângă cursele zilnice, facem și deplasări de firmă: o conferință, un team building, o vizită la un client. Același șofer tot drumul.' }
    ],
    intrebari: [
      { q: 'Emiteți factură?', a: 'Da. Pentru transportul de angajați lucrăm cu contract și factură.' },
      { q: 'Câți angajați puteți transporta pe o cursă?', a: 'Până la 20 cu un Mercedes Sprinter sau 8 cu un Renault Trafic ori un Mercedes Vito. Pentru mai mulți, discutăm câte mașini sunt necesare.' }
    ]
  },
  {
    slug: 'excursii-circuite-romania',
    titlu: 'Excursii cu microbuz și șofer prin România',
    descriere: 'Circuite și excursii de grup prin România cu microbuz și șofer: Transfăgărășan, mănăstirile din nord, cetățile din Transilvania. Preț fix.',
    scop: 'circuit prin România',
    eticheta: 'Circuite prin România',
    h1: 'Excursii de grup prin România, cu microbuz și șofer',
    lead: 'Voi alegeți unde vreți să ajungeți, noi facem traseul și conducem. Mănăstirile din nord, cetățile din Transilvania, Transfăgărășanul: tot grupul în aceeași mașină, cu bagajele în spate.',
    masina: 'ambele',
    blocuri: [
      { titlu: 'Cum arată o excursie cu noi', lista: [
        'Vă luăm de la adresă.',
        'Șoferul conduce tot drumul. Voi stați, vorbiți, dormiți.',
        'La excursiile de o zi, șoferul rămâne cu grupul la opriri până plecați înapoi.',
        'Circuitele de mai multe zile se fac cu aceeași mașină și același șofer.'
      ] },
      { titlu: 'Ce mașină', lista: [
        'Până la 8 persoane: Renault Trafic sau Mercedes Vito, 8+1.',
        'Până la 20 de persoane: Mercedes Sprinter, cu bagaje pentru mai multe zile.'
      ] }
    ],
    intrebari: [
      { q: 'Ne ajutați cu traseul?', a: 'Da. Ne spuneți ce vreți să vedeți și câte zile aveți, iar noi facem traseul și opririle.' },
      { q: 'Șoferul ne așteaptă la opriri?', a: 'La excursiile de o zi, da: rămâne cu grupul până plecați înapoi.' }
    ]
  },
  {
    slug: 'curse-europa',
    titlu: 'Închiriere microbuz cu șofer pentru curse în Europa',
    descriere: 'Microbuz cu șofer pentru drumuri în Europa: același șofer dus și întors, Mercedes Sprinter 20+1, Mercedes Vito sau Renault Trafic 8+1. Preț fix.',
    scop: 'cursă în Europa',
    eticheta: 'Curse în Europa',
    h1: 'Microbuz cu șofer pentru drumuri în Europa',
    lead: 'Pentru un grup care pleacă din România spre o destinație din Europa: același șofer tot drumul, dus și întors, și o singură mașină pentru toți.',
    masina: 'ambele',
    blocuri: [
      { titlu: 'Pentru ce drumuri', lista: [
        'Excursii de grup și city break-uri.',
        'Deplasări de firmă, conferințe, târguri.',
        'Competiții sportive, cu echipa și echipamentul.'
      ] },
      { titlu: 'Ce ne trimiteți pentru ofertă', text: 'De unde plecați, destinația, datele de plecare și întoarcere și câți sunteți. Primiți mașina potrivită și un preț fix.' }
    ],
    intrebari: [
      { q: 'Rămâne același șofer tot drumul?', a: 'Da, același șofer, dus și întors.' },
      { q: 'Pot închiria microbuzul fără șofer pentru străinătate?', a: 'Nu. Închiriem doar cu șofer inclus.' }
    ]
  }
];

// Acasă — doar ce se schimbă pentru SEO (restul e în index.html)
export const ACASA = {
  titlu: `Închiriere microbuz cu șofer${inOras} | Roby Tours`,
  descriere: `Închiriere microbuze cu șofer${dinOras}: Mercedes Sprinter 20+1 și Renault Trafic 8+1. Excursii, transfer aeroport, nunți, curse în țară și Europa. Preț fix.`
};
