import type { DemoState, Terms, Venue, ApplicationDraft } from "@/domain/model";
export const at = (day: string, time = "18:00") =>
  `2026-${day}T${time}:00+08:00`;
export const merchantTerms: Terms = {
  version: 1,
  mode: "deposit",
  percent: 50,
  balanceDue: at("11-11"),
  instructions:
    "Sample direct payment to Sample Market Team. Use a fictional reference only; no real account is provided.",
  withdrawal:
    "Illustrative: withdrawal by 10 November 2026, 18:00 receives all booth fees paid back; later withdrawal receives no refund.",
  organizerCancellation:
    "Illustrative: organizer cancellation receives a full refund. Date or venue changes require an accept-or-withdraw response.",
  missedBalance:
    "Illustrative: a missed balance receives 24-hour follow-up before an organizer decision; no automatic cancellation.",
  refundCutoff: at("11-10"),
};
export const venueTerms: Terms = {
  ...merchantTerms,
  balanceDue: at("11-05"),
  instructions:
    "Sample direct payment to the named venue. Use a fictional reference only; no real account is provided.",
  withdrawal:
    "Illustrative: customer withdrawal by 1 November 2026, 18:00 receives all rental fees paid back; later withdrawal receives no refund of fees paid.",
  organizerCancellation:
    "Illustrative: venue cancellation receives a full refund. Material date or arrangement changes require customer agreement.",
  refundCutoff: at("11-01"),
};
export const physicalPairs = [
  ["21", "22"],
  ["22", "23"],
  ["23", "24"],
  ["24", "25"],
  ["25", "26"],
  ["27", "28"],
  ["28", "29"],
  ["29", "30"],
  ["30", "31"],
  ["31", "32"],
];
export const venues: Venue[] = [
  {
    id: "sample-garden",
    name: "Sample Garden",
    area: "Talomo",
    address: "Illustrative garden setting, Talomo, Davao City",
    capacity: 120,
    price: 1800000,
    image: "/demo/garden.jpg",
    description:
      "An open-air setting for gatherings that feel a little closer to nature.",
    amenities: ["Garden ceremony area", "Covered dining", "Sample parking"],
    restrictions:
      "Outdoor sound ends at 20:00. Discuss a wet-weather arrangement.",
    access:
      "Sample level approach; confirm accessibility and loading needs during inquiry.",
  },
  {
    id: "sample-hall",
    name: "Sample Hall",
    area: "Poblacion",
    address: "Illustrative central setting, Poblacion, Davao City",
    capacity: 160,
    price: 2000000,
    image: "/demo/hall.jpg",
    description:
      "A flexible indoor space, ready for celebrations, makers and meaningful gatherings.",
    amenities: ["Indoor hall", "Tables & chairs", "Power access"],
    restrictions: "No open flames. Equipment and layout need venue review.",
    access:
      "Sample street-side loading and step-free entry. Confirm your specific needs with the venue.",
  },
  {
    id: "sample-pavilion",
    name: "Sample Pavilion",
    area: "Buhangin",
    address: "Illustrative pavilion setting, Buhangin, Davao City",
    capacity: 240,
    price: 2600000,
    image: "/demo/pavilion.jpg",
    description:
      "Room to bring people together, with an airy setting and space to make it yours.",
    amenities: ["Covered pavilion", "Open floor area", "Sample parking"],
    restrictions:
      "Keep circulation routes clear. Discuss sound and equipment limits.",
    access:
      "Sample dedicated loading area; confirm vehicle access before the event.",
  },
];
export function createFixture(): DemoState {
  const businesses: [string, string, 1 | 2, string[][], boolean][] = [
    ["Brew Corner", "Coffee", 1, [["23"], ["24"]], true],
    [
      "Paper and Clay",
      "Crafts",
      2,
      [
        ["23", "24"],
        ["30", "31"],
      ],
      false,
    ],
    ["Sweet Tray", "Pastries", 1, [["25"], ["26"]], false],
    ["Green Goods", "Plants", 1, [["21"], ["22"]], false],
    [
      "Stitch Studio",
      "Apparel",
      2,
      [
        ["27", "28"],
        ["28", "29"],
      ],
      false,
    ],
    ["Iced Sip", "Coffee", 1, [["30"], ["31"]], true],
    ["Local Finds", "Accessories", 1, [["28"], ["29"]], false],
    ["Pantry Picks", "Packaged food", 1, [["22"], ["21"]], false],
  ];
  const drafts: ApplicationDraft[] = businesses.map(
    ([name, category, quantity, choices, power]) => ({
      id: name.toLowerCase().replaceAll(" ", "-"),
      name,
      contact: `${name.toLowerCase().replaceAll(" ", "")}@example.test`,
      category,
      products:
        name === "Paper and Clay"
          ? "Handmade paper goods, small-batch pottery and gifts"
          : `Sample ${category.toLowerCase()} products`,
      needs: power
        ? "Power connection for sample equipment"
        : "Table display; no cooking",
      power,
      watts: power ? 400 : 0,
      quantity,
      choices,
      alternatives: true,
      photo: "/demo/products.svg",
    }),
  );
  const booths = Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 21),
    row: i < 6 ? "A" : "B",
    width: 2,
    depth: 2,
    price: 200000,
    power: [23, 24, 30, 31].includes(i + 21),
    watts: 500,
    inclusions: "One table, two chairs; full event edition",
    restrictions: "No open flames; keep walkway clear",
    unavailable: false,
  }));
  return {
    schemaVersion: 1,
    revision: 0,
    scene: "merchant-entry",
    now: at("11-01", "10:00"),
    role: "merchant",
    identity: "paper-and-clay",
    venues: structuredClone(venues),
    profiles: drafts.map((d) => ({
      id: d.id,
      name: d.name,
      contact: d.contact,
      category: d.category,
      products: d.products,
      needs: d.needs,
      power: d.power,
      watts: d.watts,
      photo: d.photo,
    })),
    event: {
      id: "makers-market-2026",
      name: "Sample Davao Makers Market",
      organizer: "Sample Market Team",
      contact: "market@example.test",
      description:
        "A weekend for locally inspired crafts, food and independent businesses. Explore a thoughtful mix of makers in a welcoming indoor setting. All event details are fictional.",
      start: at("11-14", "10:00"),
      end: at("11-15", "20:00"),
      setup: at("11-13", "14:00"),
      cleanup: at("11-15", "22:00"),
      opens: at("10-20", "09:00"),
      closes: at("11-05"),
      decisions: at("11-06"),
      categories:
        "Crafts, coffee, pastries, plants, apparel, accessories and packaged food",
      selection:
        "The organizer reviews products, operating needs and space fit after applications close. Applying is not a reservation.",
      status: "draft",
      terms: structuredClone(merchantTerms),
      arrangement: {
        version: 1,
        agreedVersion: null,
        rules:
          "No open flames. Keep the walkway clear. Maximum 500W at powered booths.",
        accessStart: at("11-13", "14:00"),
        accessEnd: at("11-15", "22:00"),
        existing: false,
        venueName: "Sample Hall",
        address: "Illustrative central setting, Poblacion, Davao City",
        contact: "hall@example.test",
        prerequisite: "none",
        packet: [
          {
            id: "brief",
            title: "Event brief",
            owner: "organizer",
            required: true,
            applicable: true,
            version: 1,
            supplied: true,
            reviewedVersion: null,
            change: "",
            preview:
              "Sample makers market, 14–15 November; responsible party Sample Market Team. Crafts and food displays; no open flames.",
          },
          {
            id: "layout",
            title: "Layout and equipment plan",
            owner: "organizer",
            required: true,
            applicable: true,
            version: 1,
            supplied: true,
            reviewedVersion: null,
            change: "",
            preview:
              "12 booths, 2 × 2m. Two rows separated by a walkway. Power at 23, 24, 30 and 31, maximum 500W. Ten explicit eligible pairs.",
          },
          {
            id: "terms",
            title: "Venue operating terms",
            owner: "venue",
            required: true,
            applicable: true,
            version: 1,
            supplied: true,
            reviewedVersion: null,
            change: "",
            preview:
              "Sample Hall grants access 13 November 14:00 through 15 November 22:00. Keep exits clear. Rental is separate from merchant booth fees.",
          },
        ],
        history: [],
        snapshots: [],
      },
      booths,
      pairs: structuredClone(physicalPairs),
      messages: [],
      meetings: [],
      history: [],
    },
    applications: drafts.map((d) => ({
      id: d.id,
      businessId: d.id,
      eventId: "makers-market-2026",
      draft: structuredClone(d),
      snapshots:
        d.id === "paper-and-clay"
          ? []
          : [
              {
                version: 1,
                at: at("10-25", "10:00"),
                data: structuredClone(d),
              },
            ],
      status: d.id === "paper-and-clay" ? "draft" : "submitted",
      notes: "",
      shortlisted: false,
      correctionRequested: false,
      messages: [],
      history:
        d.id === "paper-and-clay"
          ? []
          : ["Application submitted; no booth reserved."],
    })),
    bookings: [
      {
        id: "alex-celebration",
        venueId: "sample-hall",
        payerId: "alex",
        payerRole: "customer",
        draft: {
          name: "Alex",
          contact: "alex@example.test",
          purpose: "Private celebration",
          guests: 80,
          start: at("11-07", "10:00"),
          end: at("11-07", "18:00"),
          accessStart: at("11-07", "09:00"),
          accessEnd: at("11-07", "19:00"),
          package: "Whole venue with tables and chairs",
          needs: "Setup and cleanup access; step-free guest arrival",
        },
        submitted: false,
        declined: false,
        messages: [],
        history: [],
      },
      {
        id: "organizer-rental",
        venueId: "sample-hall",
        payerId: "sample-market-team",
        payerRole: "organizer",
        draft: {
          name: "Sample Market Team",
          contact: "market@example.test",
          purpose: "Sample Davao Makers Market",
          guests: 120,
          start: at("11-14", "10:00"),
          end: at("11-15", "20:00"),
          accessStart: at("11-13", "14:00"),
          accessEnd: at("11-15", "22:00"),
          package: "Whole-venue market rental",
          needs: "12-booth layout; separate venue arrangement review",
        },
        submitted: true,
        declined: false,
        messages: [],
        history: ["Separate organizer rental inquiry received."],
      },
    ],
    agreements: [],
    receipts: [],
    cancellations: [],
    processed: [],
    drafts: {},
    navigation: {},
  };
}
