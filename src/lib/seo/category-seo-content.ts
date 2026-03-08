import { labelForCategory } from '@/lib/categories';

/**
 * SEO content for each category page.
 * Each entry includes:
 *   - intro: 300-500 word HTML body rendered below listings (server-side)
 *   - faqs: 4-6 Q&A pairs, used for visible accordion + JSON-LD FAQPage schema
 *   - relatedCategories: ordered list of category slugs to show in "Complete Your Planning"
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CategorySeoContent {
  intro: string; // plain text / light HTML — kept simple so it renders safely
  faqs: FaqItem[];
  relatedCategories: string[];
}

export const CATEGORY_SEO_CONTENT: Record<string, CategorySeoContent> = {
  dresses: {
    intro: `Finding the perfect wedding dress in Morocco is one of the most important steps in your wedding journey. Whether you dream of a flowing white gown, a classic Moroccan kaftan, or a contemporary fusion design, Morocco's vibrant fashion scene offers endless possibilities for every bride.

Morocco's bridal fashion heritage blends traditional Amazigh and Arab artisanal craftsmanship with modern European silhouettes. Many local designers and ateliers specialize in hand-embroidered fabrics, silk caftans, and beaded details that cannot be found anywhere else in the world. Cities like Marrakech, Casablanca, Fes, and Rabat are home to some of the finest bridal boutiques and made-to-measure studios in North Africa.

When choosing your wedding dress vendor in Morocco, consider factors such as lead time (custom pieces typically take 6-12 weeks), budget, the number of fittings included, and whether they offer accessories such as veils, belts, and hairpieces. It is also worth asking about preservation and cleaning services after the wedding.

Most Moroccan bridal boutiques offer a private appointment experience where you can browse their collections in a relaxed, personal setting. Many will customize existing designs to match your vision — adjusting necklines, sleeve lengths, color, and embroidery to create something truly unique.

Wervice makes it easy to compare dress vendors across all major Moroccan cities. Browse verified listings, view real photos from past weddings, check starting prices, and contact vendors directly via WhatsApp — all in one place. Start your search today and find the dress of your dreams.`,
    faqs: [
      {
        question: "How early should I start looking for a wedding dress in Morocco?",
        answer: "We recommend starting your search at least 6 to 9 months before your wedding date. Custom-made Moroccan bridal gowns and kaftans can take 8 to 12 weeks to produce, and you will likely need 2 to 3 fittings. Starting early gives you enough time for alterations and avoids last-minute stress.",
      },
      {
        question: "What is the average cost of a wedding dress in Morocco?",
        answer: "Wedding dress prices in Morocco vary widely. Ready-to-wear gowns from local boutiques start from around 3,000 MAD, while custom-made dresses from established designers range from 8,000 to 30,000 MAD or more depending on the intricacy of the embroidery and fabric quality.",
      },
      {
        question: "Can I get both a white gown and a traditional Moroccan kaftan for my wedding?",
        answer: "Absolutely. Many Moroccan brides wear two or more outfits during their wedding celebration — a white bridal gown for the ceremony and one or several kaftans during the traditional ceremonies like the Henna night or the reception. Many vendors on Wervice offer both styles.",
      },
      {
        question: "Are alterations included in the price?",
        answer: "It depends on the vendor. Custom-made dresses typically include a set number of fittings and basic alterations. Always clarify this upfront when booking. Ready-to-wear gowns may require separate tailoring services.",
      },
      {
        question: "What cities in Morocco have the best bridal boutiques?",
        answer: "Casablanca and Marrakech have the largest concentration of bridal boutiques and designer studios. Fes and Rabat also have excellent traditional kaftan and wedding dress makers. Smaller cities like Meknes, Tanger, and Agadir have local ateliers that offer great value for money.",
      },
    ],
    relatedCategories: ['beauty', 'negafa', 'florist', 'venues', 'photo-film', 'event-planner'],
  },

  venues: {
    intro: `Choosing the right wedding venue is the foundation of your entire celebration. In Morocco, you are spoiled for choice — from grand riads in ancient medinas and luxurious Atlas Mountain retreats to modern ballrooms in Casablanca and oceanfront estates near Agadir.

Moroccan wedding venues are celebrated worldwide for their stunning architecture, intricate tilework, lush gardens, and incomparable atmosphere. A riad in Marrakech's Medina offers intimacy and historical charm, while a countryside domain can accommodate large guest lists with breathtaking natural backdrops. Many venues also provide in-house catering, decoration, and coordination services, simplifying your planning process.

When evaluating venues, consider capacity (both seated dinner and cocktail), indoor vs. outdoor spaces, availability on your preferred date, what is included in the rental fee (furniture, lighting, catering coordination), and accommodation options for out-of-town guests. Venue pricing in Morocco varies significantly depending on size, location, and services — asking for a full quote is always recommended.

Some couples choose a venue that doubles as accommodation, allowing the bridal party and family to stay on-site. Kasbahs, boutique hotels, and private estates frequently offer this option and it can significantly reduce day-of logistics.

Wervice lists verified wedding venues across all major Moroccan cities and regions. Browse real photos, compare capacities and pricing, and send inquiries directly to venue managers. Whether you are planning an intimate gathering of 50 or a grand celebration of 500, you will find the perfect space here.`,
    faqs: [
      {
        question: "How far in advance should I book a wedding venue in Morocco?",
        answer: "Popular venues, especially in Marrakech and Casablanca, book up 12 to 18 months in advance for peak wedding season (April–June and September–November). We strongly recommend booking your venue at least a year ahead if you have a specific date in mind.",
      },
      {
        question: "What is included in a typical venue rental in Morocco?",
        answer: "Inclusions vary greatly. Some venues offer only the space and basic furniture, while others include catering, lighting, décor coordination, and accommodation. Always request a detailed quote that specifies exactly what is and is not included to avoid surprises.",
      },
      {
        question: "What is the average cost of renting a wedding venue in Morocco?",
        answer: "Venue costs in Morocco range from 15,000 MAD for smaller or off-peak bookings to over 200,000 MAD for exclusive luxury estates. The total cost depends heavily on the size of the venue, location, season, day of the week, and included services.",
      },
      {
        question: "Can we have both indoor and outdoor spaces at a Moroccan wedding venue?",
        answer: "Yes, many Moroccan venues offer both. Riads typically have central courtyards, while domains and kasbahs often have expansive gardens. It is common to hold the ceremony or cocktail hour outside and the dinner indoors. Always check if the venue has a contingency plan in case of weather changes.",
      },
      {
        question: "Do Moroccan wedding venues allow outside caterers and décor suppliers?",
        answer: "Some do and some don't. Venues with exclusive catering partnerships may charge a corkage or kitchen fee if you bring your own caterer. Clarify this policy during your initial inquiry. Décor suppliers are usually more flexible, but always confirm with the venue.",
      },
    ],
    relatedCategories: ['caterer', 'decor', 'event-planner', 'florist', 'photo-film', 'artist'],
  },

  florist: {
    intro: `Flowers set the mood for every moment of your wedding day — from the bridal bouquet and table centrepieces to ceremony arches and aisle arrangements. Morocco's skilled floral designers draw on a rich palette of locally sourced blooms alongside imported varieties to create breathtaking arrangements that complement every wedding style.

Moroccan wedding floristry often incorporates bold, lush arrangements featuring roses, peonies, jasmine, bougainvillea, and tropical foliage. Many florists also specialize in minimalist contemporary styles, Bohemian dried-flower arrangements, or traditional Moroccan greenery and candle setups. Whatever your aesthetic, a skilled florist will translate your vision into floral art that photographs beautifully.

When hiring a florist in Morocco, schedule a consultation at least 4 to 6 months before your wedding. Bring inspiration photos and be clear about your color palette and preferred flower types. Discuss whether certain flowers are in season on your wedding date — seasonal flowers are not only more affordable but also fresher and more vibrant.

Pricing for floral design depends on the volume of arrangements needed, flower varieties, and the complexity of installations such as floral arches, suspended ceiling installations, and table runners. Most florists offer packages covering the bridal bouquet, bridesmaid bouquets, ceremony décor, and reception centrepieces.

Browse Wervice to find talented florists across Morocco. View their portfolio, compare styles, and get in touch directly to discuss your wedding vision and obtain a personalized quote.`,
    faqs: [
      {
        question: "How much does wedding floristry cost in Morocco?",
        answer: "Basic floral packages (bridal bouquet + ceremony and reception centrepieces) start from around 5,000 MAD. Full floral design packages including large installations, arches, aisle décor, and multiple centrepieces can range from 20,000 to 80,000 MAD depending on scale and flower choices.",
      },
      {
        question: "When should I book a wedding florist in Morocco?",
        answer: "Book your florist 4 to 6 months before your wedding, or earlier if your date falls during peak season (spring or early autumn). Popular florists fill up fast, especially in cities like Marrakech and Casablanca.",
      },
      {
        question: "What flowers are popular for Moroccan weddings?",
        answer: "Roses, peonies, ranunculus, jasmine, orchids, and bougainvillea are widely used. Locally grown flowers tend to be fresher and more cost-effective. Jasmine holds special cultural significance in Moroccan celebrations and is often woven into bridal hair or used in traditional rituals.",
      },
      {
        question: "Can a florist also handle the table décor and wedding arch?",
        answer: "Yes, most professional wedding florists in Morocco offer full-service floral design covering bouquets, table centrepieces, ceremony arches, aisle markers, and any other floral installation you envision. Confirm the full scope during your consultation.",
      },
      {
        question: "Do I need to visit in person to choose my flowers?",
        answer: "Not necessarily. Many florists work via WhatsApp and email, sharing mood boards and samples for couples who are planning remotely. An in-person or video consultation is recommended to finalize details, but the initial selection can often be done digitally.",
      },
    ],
    relatedCategories: ['decor', 'venues', 'event-planner', 'photo-film', 'cakes', 'caterer'],
  },

  beauty: {
    intro: `Your wedding day look is one of the most important elements of your celebration, and Morocco is home to exceptionally talented bridal makeup artists and hair stylists who blend international techniques with local beauty traditions. From luminous skin and dramatic eye looks to soft romantic waves and intricate traditional hairstyles, Moroccan beauty professionals offer a full spectrum of bridal services.

Many bridal beauty vendors in Morocco offer on-location services, coming directly to your hotel, riad, or home on the morning of your wedding. This is particularly convenient for large bridal parties, where the entire team needs hair and makeup done before the ceremony begins. Be sure to confirm whether the vendor includes a trial session in their pricing — a trial is essential to ensure the look is exactly what you want on the day.

When booking beauty services for your wedding, consider the size of your bridal party, how many hours are needed for preparation, and whether the vendor offers touch-up services throughout the day. Some vendors specialize in specific techniques such as airbrush makeup, traditional Moroccan adornments (like kohl and glitter), or specific skin tones.

Trial sessions are usually conducted 4 to 6 weeks before the wedding and allow you to test the look with your dress, accessories, and headpiece. Bring reference photos and be open with your artist about what you do and don't love so they can refine the look for the big day.

Explore Wervice's verified listing of bridal hair and makeup artists in Morocco. Check their portfolios, read real couple reviews, and contact them directly to check availability for your wedding date.`,
    faqs: [
      {
        question: "Should I book a bridal makeup trial in Morocco?",
        answer: "Yes, a trial session is strongly recommended. It allows you and your artist to test the look with your actual dress, hair accessories, and lighting conditions. Trials typically happen 4 to 6 weeks before the wedding and give you peace of mind that the look is perfect.",
      },
      {
        question: "Do bridal makeup artists in Morocco travel to the venue?",
        answer: "Most professional bridal makeup artists and hair stylists in Morocco offer on-location services — they come to your hotel, riad, or wedding venue. Confirm this when booking and clarify if travel fees apply for venues outside the city center.",
      },
      {
        question: "How much does bridal hair and makeup cost in Morocco?",
        answer: "Bridal beauty packages in Morocco typically start from around 1,500 MAD and can go up to 6,000 MAD or more for full-day services with a team covering a large bridal party. Pricing depends on the artist's experience, location, and the services included.",
      },
      {
        question: "How early should I book my wedding day makeup artist?",
        answer: "Book as early as possible — at least 6 months ahead for peak season weddings. The best bridal beauty professionals in Marrakech, Casablanca, and Rabat get booked up to a year in advance, especially for Saturday dates.",
      },
      {
        question: "Can the makeup artist also do the hair for the entire bridal party?",
        answer: "Many bridal beauty vendors in Morocco work as a team or bring assistants to handle larger parties. Clarify during booking how many people they can accommodate and how much time will be needed to ensure everyone is ready before the ceremony.",
      },
    ],
    relatedCategories: ['dresses', 'negafa', 'florist', 'photo-film', 'venues', 'event-planner'],
  },

  'photo-film': {
    intro: `Your wedding photographs and video are the memories you will revisit for the rest of your life. Choosing the right photographer and videographer is one of the most important decisions you will make in your wedding planning journey. Morocco's diverse landscapes — ancient medinas, Atlas Mountain foothills, coastal cliffs, and lush gardens — provide some of the world's most stunning backdrops for wedding photography.

Moroccan wedding photographers range from documentary-style artists who capture candid, authentic moments to fine-art photographers who create magazine-worthy editorial images. Many studios offer combined photo and film packages, covering the preparation, ceremony, and celebration in both still images and cinematic video.

When selecting a photo and film team in Morocco, review their full portfolio, not just their highlight reel. Look for consistency in editing style, ability to handle different lighting conditions (such as low-light evening receptions), and experience with weddings of a similar scale to yours. Ask about the number of edited photos delivered, the expected turnaround time, and what formats the video will be delivered in.

Many couples also opt for an engagement or pre-wedding session a day or two before the wedding. These sessions are perfect for exploring iconic Moroccan locations and getting comfortable in front of the camera before the big day.

Discover talented wedding photographers and videographers across Morocco on Wervice. Browse portfolios, compare packages and prices, and book your preferred team with confidence.`,
    faqs: [
      {
        question: "How many photos will I receive from my wedding photographer in Morocco?",
        answer: "The number of edited photos varies by package and photographer. Most full-day packages deliver between 400 and 800 edited images. Always confirm the exact number and whether both high-resolution and web-optimized files are included.",
      },
      {
        question: "Should I book a separate videographer or a combined photo-video team?",
        answer: "Both options work well. A dedicated combined team (photographer + videographer) often communicates better and can coordinate angles and lighting more efficiently. Some studios offer both services with a unified editing style. Make sure their portfolio reflects experience with both photo and video.",
      },
      {
        question: "What is the average cost of wedding photography in Morocco?",
        answer: "Photography packages start from around 5,000 MAD for emerging photographers. Established studios with a strong portfolio typically charge between 12,000 and 40,000 MAD for a full-day package. International destination wedding photographers may charge significantly more plus travel costs.",
      },
      {
        question: "Do I need to provide a shot list to my photographer?",
        answer: "It is helpful to provide a list of must-have group shots and specific moments you want captured. However, give your photographer creative freedom for the candid and artistic shots — that is what they do best. A detailed timeline of the day is more useful than an exhaustive shot list.",
      },
      {
        question: "How long does it take to receive the edited photos and video?",
        answer: "Photo galleries typically take 4 to 8 weeks to deliver. Wedding films take longer — usually 8 to 16 weeks depending on the complexity of the edit. Confirm the delivery timeline in your contract before booking.",
      },
    ],
    relatedCategories: ['event-planner', 'venues', 'florist', 'decor', 'artist', 'caterer'],
  },

  caterer: {
    intro: `Food is at the heart of every Moroccan celebration. From the iconic slow-cooked lamb tagine and honey-drizzled pastilla to lavish multi-course banquets featuring dozens of salads, couscous, and grilled meats, Moroccan wedding catering is an art form in itself. The right caterer will not only feed your guests beautifully but will also contribute significantly to the atmosphere and overall experience of your wedding day.

Professional wedding caterers in Morocco typically offer a range of menu options from traditional Moroccan banquets to contemporary fusion menus, buffet-style services, and themed catering experiences. Many also provide staffing, tableware, glassware, and beverage service as part of their packages.

When evaluating catering companies, request a tasting session (most reputable caterers offer this), check their experience with your estimated guest count, and confirm what is included in the per-person pricing. Clarify whether they bring their own equipment or require the venue's kitchen facilities, and ask about their approach to dietary restrictions and allergies.

For traditional Moroccan weddings, certain ceremonial dishes hold cultural significance — such as the first course of spiced olives and Moroccan bread (khobz), followed by couscous and then slow-cooked meats. A good caterer will guide you through menu planning while honoring both your preferences and your guests' expectations.

Find trusted catering professionals across Morocco on Wervice. Browse vendor profiles, explore menu photos, and request quotes directly through the platform.`,
    faqs: [
      {
        question: "What is typically served at a Moroccan wedding banquet?",
        answer: "A traditional Moroccan wedding banquet usually begins with an array of cold and warm salads, followed by bastilla (a savory-sweet pie), a main course of tagine or roasted lamb, couscous, and fresh fruit and Moroccan pastries for dessert. Many modern couples also include international dishes alongside traditional fare.",
      },
      {
        question: "How much does wedding catering cost per person in Morocco?",
        answer: "Wedding catering in Morocco typically ranges from 300 to 1,500 MAD per person depending on the menu complexity, number of courses, staffing, and whether drinks are included. Always request a full itemized quote including service, setup, and equipment.",
      },
      {
        question: "Can the caterer provide halal-certified food?",
        answer: "Yes. Most Moroccan wedding caterers exclusively serve halal food, as it is the standard practice. If you require kosher or other specific dietary certifications, confirm with the caterer in advance.",
      },
      {
        question: "Do caterers provide staff for service during the wedding?",
        answer: "Most professional catering companies include serving staff, a head chef, and a team lead in their packages. The staffing ratio varies — confirm the number of servers per guest to ensure smooth, attentive service throughout the meal.",
      },
      {
        question: "Can I do a tasting before booking a caterer?",
        answer: "Yes, and we strongly recommend it. Most established caterers in Morocco offer a complimentary or paid tasting session. Use this opportunity to assess quality, presentation, and portion sizes before committing.",
      },
    ],
    relatedCategories: ['venues', 'decor', 'event-planner', 'cakes', 'artist', 'florist'],
  },

  decor: {
    intro: `Wedding décor in Morocco is a world unto itself. Drawing on centuries of intricate craftsmanship — from hand-painted ceramics and woven Berber textiles to elaborate lantern arrangements and hand-carved wooden details — Moroccan wedding decorators can transform any space into an unforgettable setting.

Whether your vision is a romantic garden party with cascading floral installations, a glamorous gold and white ballroom, a Bohemian desert tent, or an authentic traditional Moroccan ambiance with zellige tiles and ornate candelabras, Morocco's skilled décor vendors can make it a reality.

Hiring a wedding decorator in Morocco typically involves an initial consultation where you share your vision, color palette, and budget. The decorator then presents a mood board and a detailed quote covering all elements: table settings, linens, floral accents, lighting, draping, ceiling installations, entrance décor, lounge areas, and any other bespoke elements you require.

Lighting is one of the most transformative elements of wedding décor and should not be overlooked. Candlelight, fairy lights, color-washed architectural uplighting, and Moroccan lanterns can create dramatically different atmospheres and are a specialty of many local decorators.

Wervice connects you with talented wedding décor professionals across Morocco's major cities. Browse real wedding galleries, explore their signature styles, and reach out to begin planning your dream setting.`,
    faqs: [
      {
        question: "How early should I book a wedding decorator in Morocco?",
        answer: "Book your decorator at least 6 to 9 months in advance, especially for peak season dates. For large-scale or bespoke decoration projects with custom fabrication, start even earlier to allow enough time for production.",
      },
      {
        question: "What does a wedding decorator in Morocco typically include?",
        answer: "A full wedding décor package usually includes table centrepieces, linens, chair covers, backdrop or arch design, entrance décor, lighting (fairy lights, uplighting or lanterns), lounge areas, and coordination on the day. Ask for a detailed itemized quote to understand exactly what is included.",
      },
      {
        question: "Can I combine floral design and wedding décor with the same vendor?",
        answer: "Yes, many wedding décor companies in Morocco offer combined floristry and décor services or work closely with a floral partner. Using one vendor for both can simplify coordination and often results in a more cohesive aesthetic.",
      },
      {
        question: "What decorating styles are popular for Moroccan weddings?",
        answer: "Popular styles include traditional Moroccan (lanterns, zellige-inspired patterns, brass details), modern minimalist (clean lines, white and gold palette), Garden-Bohemian (lush greenery, macramé, pampas grass), and luxurious Glam (crystal chandeliers, velvet draping, gold accents). Most vendors can adapt to your chosen aesthetic.",
      },
      {
        question: "How much does wedding décor typically cost in Morocco?",
        answer: "Décor budgets vary enormously. Basic décor for a medium-sized wedding starts from around 20,000 MAD. Full bespoke decoration for a large celebration with custom installations can exceed 150,000 MAD. Get multiple quotes and prioritize the elements that matter most to you.",
      },
    ],
    relatedCategories: ['florist', 'venues', 'caterer', 'event-planner', 'photo-film', 'artist'],
  },

  negafa: {
    intro: `The Negafa is a central figure in traditional Moroccan weddings, responsible for dressing the bride and guiding her through the multi-day ceremony. Far more than a stylist, the Negafa is a cultural custodian who helps the bride wear the intricate traditional bridal attire — the multiple kaftans, belts (mdeq), jewelry, headdresses, and accessories — in the correct ceremonial order.

In a traditional Moroccan wedding, the bride typically changes outfits multiple times throughout the celebration, wearing different regional costumes that represent Moroccan heritage. The Negafa guides this process, ensuring the bride is dressed beautifully and according to tradition for each outfit change. This can include the Fassi kaftan, the Chleuh dress, the Doukkala costume, and others depending on the region and family tradition.

Many modern couples choose a hybrid approach, incorporating some traditional elements — such as a ceremonial kaftan entrance — alongside a contemporary western-style ceremony. In this case, the Negafa can assist with the traditional costume elements while working alongside the bridal party for other aspects of the day.

When choosing a Negafa, look for experience with the specific regional traditions you wish to include, a strong network of traditional jewelry and accessory rentals, and positive testimonials from previous brides. Most Negafas also coordinate closely with the beauty team to ensure the hair and makeup complement each traditional outfit.

Browse Wervice to find experienced Negafas across Morocco who can guide you through this beautiful cultural tradition with expertise and grace.`,
    faqs: [
      {
        question: "What exactly does a Negafa do at a Moroccan wedding?",
        answer: "The Negafa dresses the bride in traditional Moroccan wedding attire, assists with outfit changes throughout the celebration, provides or coordinates rental of traditional jewelry and accessories, and guides the bride through cultural ceremonies. She is essentially the guardian of Moroccan bridal tradition.",
      },
      {
        question: "How many outfit changes does a Moroccan bride typically have?",
        answer: "In a traditional Moroccan wedding, the bride may change outfits three to seven times, wearing different regional costumes over the course of the celebration. The exact number depends on the family's traditions, regional origin, and the couple's preferences.",
      },
      {
        question: "Can a modern bride have just one traditional outfit with a Negafa?",
        answer: "Absolutely. Many contemporary brides choose a single kaftan entrance as a nod to tradition while wearing a western gown for the rest of the celebration. The Negafa can accommodate this and will ensure that one ceremonial outfit is worn and presented beautifully.",
      },
      {
        question: "Does the Negafa provide the traditional jewelry and costumes?",
        answer: "Most Negafas have an extensive collection of traditional jewelry and accessories for rental or are well-connected with suppliers. Confirm during your consultation what is included in their service and what needs to be sourced separately.",
      },
      {
        question: "How much does a Negafa cost in Morocco?",
        answer: "Negafa services in Morocco typically range from 3,000 to 15,000 MAD depending on the scope of services, the number of outfit changes, whether accessories are included, and the Negafa's reputation and experience.",
      },
    ],
    relatedCategories: ['dresses', 'beauty', 'florist', 'photo-film', 'venues', 'event-planner'],
  },

  artist: {
    intro: `Music and entertainment are the soul of a Moroccan wedding. From traditional Gnawa musicians and the hypnotic rhythms of live orchestras to contemporary DJs, violinists, and international performers, Morocco offers an extraordinary range of artistic talent to make your wedding celebration truly unforgettable.

Moroccan wedding entertainment spans centuries of musical tradition. A traditional Takht ensemble featuring oud, violin, qanun, and percussion creates an elegant ambiance for cocktail hours and dinners. Chaabi bands bring the dance floor to life, while Aissawa and Gnawa groups add a deeply spiritual and culturally significant dimension to traditional ceremonies. For more contemporary tastes, professional DJs, live bands covering popular Arabic and Western hits, and even acrobats and fire performers are all available through Wervice.

When booking entertainment for your wedding, consider the size of your venue, your guests' musical preferences, and the timeline of the event. Many couples opt for multiple entertainment acts — a live musical performance during the cocktail hour, a classical ensemble during dinner, and a DJ or live band for dancing late into the night.

It is important to discuss set times, break requirements, equipment provision (PA system, lighting), and any amplification restrictions at your venue with your chosen artists before confirming the booking.

Find exceptional wedding entertainment artists across Morocco on Wervice. Browse audio and video samples, read reviews, and contact performers directly to check availability for your wedding date.`,
    faqs: [
      {
        question: "What types of musical entertainment are popular at Moroccan weddings?",
        answer: "Popular options include Takht ensembles (classical Arabic instruments), Chaabi bands, Gnawa musicians, live wedding orchestras, violin trios, DJs, and contemporary Arabic or international live bands. Many couples combine multiple acts for different parts of the evening.",
      },
      {
        question: "Should I book a DJ or a live band for my wedding reception?",
        answer: "Both are excellent choices. A live band creates an energetic and unique atmosphere, while a DJ offers more flexibility across music genres and can read the crowd's energy throughout the evening. Budget permitting, many couples book a live act for the first part of the evening and a DJ for later.",
      },
      {
        question: "How much does wedding entertainment cost in Morocco?",
        answer: "Prices vary greatly by act type and duration. A DJ typically costs between 4,000 and 15,000 MAD. Live bands and ensembles range from 8,000 to 50,000 MAD or more depending on the number of musicians, duration, and prestige of the group.",
      },
      {
        question: "What technical requirements should I confirm with the artist?",
        answer: "Always confirm PA system requirements (speakers, mixer, microphones), lighting needs, stage size, power supply, sound check schedule, and any venue-specific restrictions on decibel levels or performance hours. Many artists bring their own equipment; confirm this in advance.",
      },
      {
        question: "Can I request a specific song list or setlist?",
        answer: "Yes. Most professional wedding musicians and DJs are happy to work with a must-play and do-not-play list. For live bands, confirm their repertoire during the booking process and ensure your key songs are in their set. A good wedding DJ will blend your preferences with crowd-reading expertise.",
      },
    ],
    relatedCategories: ['event-planner', 'venues', 'caterer', 'decor', 'photo-film', 'florist'],
  },

  'event-planner': {
    intro: `Planning a wedding in Morocco involves coordinating dozens of moving parts — venues, vendors, guest logistics, cultural traditions, and countless personal details. A professional wedding planner or event coordinator takes this complexity off your shoulders, ensuring every element comes together seamlessly on your most important day.

Moroccan wedding planners bring local expertise, established vendor relationships, and deep cultural knowledge to your planning process. They know which vendors deliver consistently, how to navigate venue contracts, what typical Moroccan wedding timelines look like, and how to manage the unexpected challenges that inevitably arise on a wedding day.

There are different levels of planning support to consider: full-service planning (where the planner manages everything from venue selection to day-of coordination), partial planning (where you handle some elements yourself and the planner fills in the gaps), and day-of coordination (where the planner takes over the week before the wedding to execute the plan you have built).

For destination weddings — where the couple and many guests are traveling to Morocco — a full-service planner is almost essential. They act as your local eyes and ears, handling logistics, supplier communication, and on-the-ground arrangements from start to finish.

Find experienced wedding planners and event coordinators across Morocco on Wervice. Compare their services, review past events, and schedule a consultation to discuss how they can help make your wedding vision a reality.`,
    faqs: [
      {
        question: "Do I need a wedding planner for a wedding in Morocco?",
        answer: "While not mandatory, a wedding planner is highly recommended, especially for destination weddings, large celebrations, or couples who do not have time to manage the details themselves. A planner's expertise and local connections can save you time, money, and significant stress.",
      },
      {
        question: "What is the difference between a wedding planner and a day-of coordinator?",
        answer: "A wedding planner is involved throughout the entire planning process — from vendor selection to timeline creation. A day-of coordinator (or month-of coordinator) takes over close to the wedding date to execute the plan you have put together. The latter is more affordable but requires you to do most of the upfront planning.",
      },
      {
        question: "How much does a wedding planner cost in Morocco?",
        answer: "Wedding planner fees in Morocco vary. Day-of coordination typically costs between 5,000 and 15,000 MAD. Full-service planning for a large wedding can range from 20,000 to 80,000 MAD or more, sometimes structured as a percentage (typically 10–15%) of the total wedding budget.",
      },
      {
        question: "Can a Moroccan wedding planner help with international guest logistics?",
        answer: "Yes, many Moroccan wedding planners specialize in destination weddings and can assist with hotel room blocks, airport transfers, welcome gifts, excursion planning, and all the logistics involved in hosting international guests. Ask specifically about their experience with destination events.",
      },
      {
        question: "When should I hire a wedding planner in Morocco?",
        answer: "For full-service planning, ideally hire a planner 12 to 18 months before your wedding date. For day-of coordination, 3 to 6 months ahead is sufficient. The earlier you engage a planner, the more value they can add to your overall planning process.",
      },
    ],
    relatedCategories: ['venues', 'caterer', 'florist', 'decor', 'photo-film', 'artist'],
  },

  cakes: {
    intro: `The wedding cake has become an increasingly important part of Moroccan wedding celebrations, blending local culinary traditions with contemporary patisserie artistry. From elegant tiered cakes adorned with sugar flowers and gold leaf to Moroccan-inspired designs featuring geometric patterns and delicate piping, wedding cake artists in Morocco create show-stopping centrepieces that taste as good as they look.

Traditional Moroccan weddings have long featured an array of sweets — chebakia, briouats with almonds, kaab el ghazal (gazelle horns), and sellou — which are deeply rooted in culinary heritage. Today, many couples incorporate both a contemporary wedding cake for a modern cake-cutting moment alongside a traditional Moroccan sweets platter for their guests.

When choosing a wedding cake maker, arrange a tasting session to sample flavors and fillings. Popular choices include lemon and raspberry, dark chocolate ganache, vanilla bean, pistachio and rose, and almond cream. Discuss your design vision, color palette, and the number of tiers or servings required based on your guest count.

Cake delivery and setup logistics are important to confirm — cakes are delicate, and transport to the venue requires care and timing. Confirm whether the baker delivers and sets up the cake, and discuss how they handle any last-minute adjustments on the day.

Discover talented wedding cake artists across Morocco on Wervice. Browse their galleries, arrange tastings, and book your dream cake directly through the platform.`,
    faqs: [
      {
        question: "How far in advance should I order my wedding cake in Morocco?",
        answer: "Book your wedding cake at least 3 to 6 months in advance. For peak season dates (spring and autumn), book even earlier. Tasting sessions are usually offered 1 to 2 months before the wedding to finalize flavors and design.",
      },
      {
        question: "How many servings do I need for my wedding cake?",
        answer: "As a general guide, plan for one serving per guest. If you are also serving a dessert table or traditional Moroccan sweets, you can plan for fewer cake servings. Your baker will help you calculate the right number of tiers based on your confirmed guest count.",
      },
      {
        question: "What flavors are popular for wedding cakes in Morocco?",
        answer: "Popular flavors include vanilla with fresh fruit, lemon and raspberry, chocolate ganache, pistachio and rose water, orange blossom cream, and almond. Many couples choose different flavors for each tier to offer variety.",
      },
      {
        question: "Can the baker also provide a Moroccan sweets table?",
        answer: "Many wedding patissiers in Morocco offer complete dessert packages including the main cake, a traditional Moroccan sweets tower, and a dessert buffet. This is a popular option that combines both contemporary and traditional elements beautifully.",
      },
      {
        question: "How much does a wedding cake cost in Morocco?",
        answer: "Wedding cake pricing typically starts from around 2,000 MAD for a simple two-tier cake and can reach 15,000 MAD or more for large, elaborate multi-tier designs with custom sugar flowers and complex decorations. Pricing is usually calculated per serving plus design complexity.",
      },
    ],
    relatedCategories: ['caterer', 'venues', 'event-planner', 'florist', 'decor', 'photo-film'],
  },
};

/** Returns content for a given category slug, falling back to empty defaults. */
type UiLocale = 'en' | 'fr' | 'ar';

function getLocalizedTemplateContent(categorySlug: string, locale: UiLocale): CategorySeoContent | null {
  if (locale === 'en') return null;
  const english = CATEGORY_SEO_CONTENT[categorySlug];
  if (!english) return null;

  const categoryLabel = labelForCategory(categorySlug, locale);

  if (locale === 'fr') {
    return {
      intro: `Trouver le bon prestataire ${categoryLabel.toLowerCase()} est une étape essentielle pour organiser un mariage réussi au Maroc. Chaque couple a un style, un budget et des priorités différents, c'est pourquoi il est important de comparer les options disponibles avant de réserver.

Sur Wervice, vous pouvez découvrir des prestataires vérifiés, consulter leurs photos, comparer leurs services et contacter directement les meilleurs profils. Que vous prépariez un mariage intime ou une grande célébration, vous trouverez des professionnels adaptés à votre vision.

Prenez le temps d'analyser les portfolios, les disponibilités et les fourchettes de prix. Une bonne sélection en amont vous aidera à gagner du temps, à éviter les imprévus et à construire une expérience fluide pour vos invités.`,
      faqs: [
        {
          question: `Quand faut-il réserver un prestataire ${categoryLabel.toLowerCase()} au Maroc ?`,
          answer: `Il est recommandé de réserver votre prestataire ${categoryLabel.toLowerCase()} entre 4 et 9 mois avant la date du mariage, et plus tôt en haute saison.`,
        },
        {
          question: `Comment comparer les prestataires ${categoryLabel.toLowerCase()} ?`,
          answer: `Comparez leur portfolio, leur expérience, la qualité des prestations, les avis clients, les délais et les tarifs avant de prendre votre décision.`,
        },
        {
          question: `Quel budget prévoir pour ${categoryLabel.toLowerCase()} ?`,
          answer: `Le budget dépend de la ville, du niveau de service et de la complexité de votre événement. Demandez toujours un devis détaillé.`,
        },
        {
          question: `Peut-on personnaliser les prestations ?`,
          answer: `Oui. La majorité des prestataires proposent des offres personnalisables selon vos besoins, votre thème et votre planning.`,
        },
        {
          question: `Peut-on organiser à distance ?`,
          answer: `Oui. Beaucoup de prestataires travaillent via WhatsApp, appel vidéo et email, ce qui facilite l'organisation à distance.`,
        },
      ],
      relatedCategories: english.relatedCategories,
    };
  }

  return {
    intro: `اختيار مزوّد ${categoryLabel} المناسب خطوة أساسية لتنظيم زفاف ناجح في المغرب. لكل زوجين أسلوب وميزانية وأولويات مختلفة، لذلك من المهم مقارنة الخيارات المتاحة قبل الحجز.

على Wervice يمكنك اكتشاف مزوّدين موثوقين، مشاهدة الأعمال السابقة، مقارنة الخدمات، والتواصل مباشرة مع أفضل الخيارات. سواء كنت تخطط لحفل صغير أو احتفال كبير، ستجد مزوّدين مناسبين لرؤيتك.

من الأفضل مراجعة المعرض، التوفر، ومستوى الأسعار قبل اتخاذ القرار النهائي. الاختيار الجيد مبكرًا يساعدك على توفير الوقت وتجنب المفاجآت وتنظيم تجربة مريحة لضيوفك.`,
    faqs: [
      {
        question: `متى يجب حجز مزوّد ${categoryLabel} في المغرب؟`,
        answer: `يُنصح بالحجز قبل موعد الزفاف من 4 إلى 9 أشهر، ومع موسم الذروة من الأفضل الحجز أبكر.`,
      },
      {
        question: `كيف أقارن بين مزوّدي ${categoryLabel}؟`,
        answer: `قارن الأعمال السابقة، الخبرة، جودة الخدمة، آراء العملاء، المواعيد المتاحة، والأسعار قبل اختيارك النهائي.`,
      },
      {
        question: `ما الميزانية المناسبة لخدمات ${categoryLabel}؟`,
        answer: `الميزانية تختلف حسب المدينة ومستوى الخدمة وتعقيد الحفل. اطلب دائمًا عرض سعر مفصل قبل التأكيد.`,
      },
      {
        question: `هل يمكن تخصيص الخدمة حسب احتياجاتي؟`,
        answer: `نعم، معظم المزوّدين يقدمون باقات قابلة للتخصيص حسب الميزانية، النمط، وعدد الضيوف.`,
      },
      {
        question: `هل يمكن التخطيط عن بُعد؟`,
        answer: `نعم، عدد كبير من المزوّدين يعملون عبر واتساب والمكالمات المرئية والبريد الإلكتروني لتسهيل التخطيط عن بُعد.`,
      },
    ],
    relatedCategories: english.relatedCategories,
  };
}

export function getCategorySeoContent(categorySlug: string, locale: string = 'en'): CategorySeoContent {
  const normalizedLocale = (locale || 'en').toLowerCase() as UiLocale;
  const localized = getLocalizedTemplateContent(categorySlug, normalizedLocale);
  if (localized) return localized;
  return CATEGORY_SEO_CONTENT[categorySlug] ?? {
    intro: '',
    faqs: [],
    relatedCategories: [],
  };
}
