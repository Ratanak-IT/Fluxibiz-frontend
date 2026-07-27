Update the existing FluxiBiz landing page into a more distinctive, premium, product-led website.

Work from the current implementation. Do not rebuild the landing page from scratch.

The current project already uses:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Existing FluxiBiz design tokens
- Existing `ScrollReveal` component
- Existing `Reveal` component
- Existing shared components such as:
  - `Section`
  - `SectionHeading`
  - `Eyebrow`
  - `RuledEyebrow`
  - `Accent`
  - `Card`
  - `Button`
  - `Badge`
  - `EditableImage`

Preserve this setup and improve it.

Do not implement Pricing or Data Migration sections in this update.

PROJECT CONTEXT

FluxiBiz is an all-in-one business management platform designed mainly for small and medium businesses in Cambodia.

Core capabilities include:

- Point of sale
- Item and item-group management
- Inventory management
- Stock movement tracking
- Low-stock monitoring
- Orders and sales
- Cash and digital payments
- KHQR payment workflow
- USD and KHR currency support
- Customer management
- Customer membership
- Staff roles and permissions
- Online storefront
- Telegram ordering
- Messenger ordering
- Business reports and analytics
- Desktop, tablet, and mobile access

FluxiBiz should not be presented only as a restaurant system.

The public landing page should support these business types:

- Retail
- Café and restaurant
- Service business

PRIMARY PRODUCT MESSAGE

Use this idea consistently across the page:

“Every sale, payment, stock movement, customer, and report stays connected.”

The page should communicate one connected product workflow instead of showing unrelated SaaS cards.

CURRENT COMPONENTS

The current page contains:

- `NavbarBeforeLoginComponent`
- `HeroSection`
- `ProductPreview`
- `FeatureCards`
- `ToolsBento`
- `DayTimeline`
- `SurfacesSection`
- `MigrationSection`
- `PricingSection`

Keep and improve:

- `NavbarBeforeLoginComponent`
- `HeroSection`
- `ProductPreview`
- `FeatureCards`
- `ToolsBento`
- `DayTimeline`
- `SurfacesSection`

Remove from the landing page:

- `MigrationSection`
- `PricingSection`

Create:

- `CambodiaSupportStrip`
- `BusinessTypeSwitcher`
- `ReliabilitySection`
- `FAQSection`
- `FinalCTASection`
- `LandingFooter`

FINAL SECTION ORDER

Use this section order:

1. `NavbarBeforeLoginComponent`
2. `HeroSection`
3. `CambodiaSupportStrip`
4. `ProductPreview`
5. `FeatureCards`
6. `ToolsBento`
7. `BusinessTypeSwitcher`
8. `DayTimeline`
9. `SurfacesSection`
10. `ReliabilitySection`
11. `FAQSection`
12. `FinalCTASection`
13. `LandingFooter`

GENERAL DESIGN DIRECTION

The design should feel:

- Modern
- Operational
- Trustworthy
- Product-led
- Premium but approachable
- Suitable for Cambodian businesses
- Professional enough for growing businesses
- Clear enough for non-technical business owners

Avoid:

- Generic SaaS appearance
- Excessive gradients
- Excessive glassmorphism
- Decorative blobs everywhere
- Neon styling
- Overuse of rounded pills
- Identical white cards in every section
- Excessive animation
- Fake testimonials
- Fake company logos
- Fake customer results
- Unsupported product claims
- Competitor screenshots
- Restaurant-only messaging

Use actual FluxiBiz application screens and designed product UI fragments as the main visual assets.

STANDARD COLOR SYSTEM

Keep the existing FluxiBiz color system.

Continue using existing semantic and brand tokens such as:

- `bg-background`
- `text-foreground`
- `text-muted-foreground`
- `border-border`
- `bg-muted`
- `bg-card`
- `bg-brand`
- `bg-brand-soft`
- `text-brand`
- `text-brand-deep`
- Existing amber token
- Existing rose token
- Existing light-mode and dark-mode variables

Use:

- FluxiBiz green as the main brand and primary action color
- Deep green for major emphasis sections
- Warm off-white for page backgrounds
- Light green for supporting sections
- Amber for highlights and payment-related accents
- Rose or red only for warning and low-stock states

Do not introduce a different color palette.

Do not replace the green system with:

- Blue
- Purple
- Neon green
- Gradient-heavy styling

Avoid hardcoded colors when an existing design token is available.

SECTION BACKGROUND RHYTHM

Use alternating backgrounds to create stronger visual rhythm:

- Warm off-white
- White
- Brand-soft
- Dark green
- White
- Light neutral

Do not place every section on the same white background.

TYPOGRAPHY

Keep the current typography system unless there is a strong reason to refine it.

Use:

- One strong display or sans-serif font for headings
- One readable sans-serif font for body text
- Monospace only for:
  - Invoice numbers
  - Order numbers
  - Currency values
  - Stock quantities
  - Timestamps
  - Payment statuses

The italic serif style may remain as a rare accent.

Do not use it in every major heading.

NAVIGATION STYLING UPDATE

Improve `NavbarBeforeLoginComponent` visually without changing its information architecture.

KEEP EXACTLY

Do not add, remove, rename, or reorder:

- FluxiBiz logo
- Business
- Feature
- Store
- About us
- Theme toggle
- English and Khmer language selector
- Login button
- Register button
- Mobile navigation sheet
- Existing links
- Existing routes

Do not replace the links with:

- Product
- Solutions
- How it works
- FAQ

DESKTOP NAVBAR STYLE

Keep the navbar sticky.

Improve it with:

- Height around 64–68px
- Better horizontal and vertical spacing
- `bg-background/85`
- Backdrop blur
- Subtle bottom border
- Very soft shadow after content scrolls behind it
- Better alignment between logo, navigation, selectors, and buttons
- Container width aligned with the landing-page content

Keep the logo around 125–140px wide.

Do not make the navbar oversized.

NAVIGATION LINKS

Keep:

- Business
- Feature
- Store
- About us

Style them with:

- Medium or semibold font weight
- Muted foreground by default
- Foreground or brand color on hover
- Subtle animated underline or bottom indicator
- 200–300ms transitions
- Visible keyboard focus states

Do not place each navigation link inside a pill or card.

Use only one active navigation style:

- Brand-colored text
- Small underline
- Or small bottom dot

LOGIN BUTTON

Keep the label:

“Login”

Make it the secondary action:

- Transparent or subtle brand-soft background
- Brand-green text
- Thin brand border
- Rounded-full
- Clear hover state
- Clear focus state

REGISTER BUTTON

Keep the label:

“Register”

Make it the primary action:

- Brand-green background
- White text
- Rounded-full
- Slightly stronger visual weight than Login
- Subtle shadow
- Darker green hover state
- Accessible focus ring

Do not use amber as the main Register button color.

LANGUAGE SELECTOR

Keep:

- English
- Khmer
- Current flags
- Current dropdown behavior

Improve it with:

- Slightly smaller flag
- Compact rounded trigger
- Subtle hover background
- Better chevron alignment
- Existing semantic colors

It should not compete visually with Login and Register.

THEME TOGGLE

Keep the current `ThemeToggle`.

Only improve its spacing and alignment.

Do not replace its internal behavior unless required for design consistency.

MOBILE NAVIGATION

Keep the existing right-side mobile sheet.

Improve:

- Spacing
- Touch targets
- Dividers
- Button consistency
- Language selector alignment
- Theme toggle alignment

Keep:

- Logo
- Navigation links
- Theme toggle
- Language selector
- Login
- Register

Use the same button hierarchy as desktop:

- Login is secondary
- Register is primary green

Do not use different action colors between desktop and mobile.

HERO SECTION

Preserve the current two-column structure, but improve the product story.

REMOVE

Remove:

- “Explore our new AI features”
- Unsupported AI messaging
- “+18% this week” unless clearly marked as demonstration data
- Unsupported customer-performance claims
- “Start a free trial” unless a real self-service trial exists
- Excessive floating dots
- Excessive independent analytics cards

EYEBROW

Use:

“Built for modern Cambodian businesses”

HEADLINE

Use:

“Sell, manage, and grow from one connected system.”

Highlight “connected system” using the existing amber highlight or hand-drawn underline treatment.

SUPPORTING TEXT

Use:

“FluxiBiz connects your point of sale, inventory, payments, online orders, customers, staff, and reports in one clear workspace.”

PRIMARY CTA

Use:

“Explore FluxiBiz”

Link it to the product preview or main product section.

SECONDARY CTA

Use:

“See how it works”

Link it to the connected workflow or business-day section.

LOCAL CAPABILITY ROW

Below the CTA, show:

- USD + KHR
- KHQR-ready
- Khmer + English
- Works on any device

Suggested Lucide icons:

- `Banknote`
- `QrCode`
- `Languages`
- `MonitorSmartphone`

HERO VISUAL

Replace the generic analytics-card cluster with a compact connected FluxiBiz activity workspace.

The main preview should show:

- Incoming order
- Order channel
- Order items
- Order total
- Payment method
- Payment status
- Stock update
- Daily summary

Example main card:

- Header: “Live business activity”
- Order: `#2241`
- Channel: Telegram
- Items:
  - Iced Latte
  - Beef Lok Lak
  - Kampot Cola
- Total: `$17.25`
- Payment: KHQR
- Status: Paid

Supporting card 1:

- Title: “Stock updated”
- Item: Kampot Cola
- Quantity: `13 → 12`
- Threshold: `10`

Supporting card 2:

- Title: “Dashboard updated”
- Orders: `124`
- Revenue: `$2,410`
- Include a small label: “Demo data”

Animate a simple sequence:

1. Order received
2. Payment succeeds
3. Stock quantity changes
4. Dashboard values update

Use lightweight controlled animation.

Do not build a complex simulator yet.

Do not show more than three floating cards at once.

CAMBODIA SUPPORT STRIP

Create a compact section immediately after the hero.

Heading:

“Built for how businesses operate in Cambodia”

Show:

- USD and KHR
- KHQR payment workflow
- Khmer and English
- Telegram and Messenger
- Desktop, tablet, and mobile

Use small line icons and concise labels.

Desktop:

- One horizontal row

Mobile:

- Wrapped two-column layout

Do not use large cards.

PRODUCT PREVIEW

Keep the large dashboard-preview structure.

Update the receipt overlay.

Replace:

`IPOS · #2241`

With:

`FluxiBiz · #2241`

Replace restaurant-specific text such as:

`Table 04`

With:

`Counter`

Suggested receipt content:

FluxiBiz · #2241
Counter · 12:41

1× Iced Latte        $2.75
2× Beef Lok Lak     $13.00
1× Kampot Cola       $1.50

Total               $17.25
KHQR · Paid

Replace the second notification.

Current:

“Cash drawer opened”

New:

“Payment completed”
“Order #2241 · KHQR”
“+$17.25”

Add an optional third notification on large screens:

“Stock updated”
“Kampot Cola · 13 → 12”

Keep visible floating overlays limited to three.

Use consistent success styling.

FEATURE CARDS

Change this section from generic features to business outcomes.

EYEBROW

Use:

“Connected by design”

HEADING

Use:

“Everything behind every sale, working together”

DESCRIPTION

Use:

“Process orders, receive payments, control stock, and understand performance without switching between disconnected tools.”

Replace the current three features with four.

FEATURE 1

Title:

“Sell without slowing down”

Body:

“Find items quickly, build orders, apply discounts, accept payments, and issue receipts from one focused point-of-sale screen.”

Icon:

- `ShoppingCart`
- Or `ScanBarcode`

Tag:

“Fast checkout”

FEATURE 2

Title:

“Know exactly what is in stock”

Body:

“Track every stock change, view current quantities, and identify low-stock or out-of-stock items before they interrupt sales.”

Icon:

`PackageSearch`

Tag:

“Live stock”

FEATURE 3

Title:

“Accept orders beyond the counter”

Body:

“Bring counter, storefront, Telegram, and Messenger orders into one shared workflow.”

Icon:

- `MessagesSquare`
- Or `PanelsTopLeft`

Tag:

“One order flow”

FEATURE 4

Title:

“Understand every business day”

Body:

“Review sales, payments, stock activity, customers, and staff performance from one business dashboard.”

Icon:

- `ChartNoAxesCombined`
- Or `LayoutDashboard`

Tag:

“Clear reports”

LAYOUT

Use:

- One column on mobile
- Two columns on medium screens
- Four columns only on sufficiently wide screens

Do not create narrow unreadable cards.

Use actual FluxiBiz UI fragments rather than generic stock photography.

REMOVE THESE PHRASES

Remove:

- “Dynamic business”
- “Automate reorders”
- “Recipe-level counts”
- “Across every location”

Do not imply multi-location support unless it exists.

TOOLS BENTO

Keep the bento layout but update the content to reflect actual FluxiBiz modules.

EYEBROW

Use:

“Everything in one place”

HEADING

Use:

“One workspace for the work behind every sale”

DESCRIPTION

Use:

“FluxiBiz connects the counter, online orders, inventory, payments, customers, staff, and reports.”

BENTO CARD 1

Label:

“Point of sale”

Title:

“A focused checkout your team can learn quickly”

Visual:

- FluxiBiz POS screen
- Item grid
- Current order
- Payment action

Make this the largest card.

BENTO CARD 2

Label:

“Unified orders”

Title:

“Counter and online orders in one queue”

Use a dark-green card.

Show channel badges:

- POS
- Storefront
- Telegram
- Messenger

Show order states:

- New
- Accepted
- Preparing
- Completed

BENTO CARD 3

Label:

“Payments”

Title:

“Cash and digital payments, clearly recorded”

Use a warm or amber-accented card.

Show:

- Order total
- Payment method
- Pending → Paid
- Receipt generated

BENTO CARD 4

Label:

“Inventory”

Title:

“Stock status without manual counting”

Use actual quantities rather than percentages.

Example:

- Coffee beans: `72 kg` — In stock
- Rice: `45 bags` — In stock
- Cola cans: `8` — Low stock

Do not say “automatic reorder” unless that capability exists.

BENTO CARD 5

Label:

“Reports”

Title:

“Know what happened today”

Show:

- Sales
- Orders
- Cash
- Digital payments
- Small trend chart

BENTO CARD 6

Label:

“Customers”

Title:

“Keep useful customer history”

Show:

- Customer name
- Membership
- Total orders
- Total spend

BENTO CARD 7

Label:

“Staff access”

Title:

“Give each employee the right access”

Show example roles:

- Owner
- Cashier
- Stock manager
- Staff

Remove the existing restaurant ticket used as “Social commerce.”

Replace it with a proper Telegram or Messenger order preview.

Remove constant bouncing animation.

Use brief status animation only when content enters the viewport or changes state.

BUSINESS TYPE SWITCHER

Create a client component:

`BusinessTypeSwitcher`

HEADING

Use:

“FluxiBiz adapts to the way you work”

DESCRIPTION

Use:

“Choose a business type to see how the same connected system supports different workflows.”

TABS

Use:

- Retail
- Café & Restaurant
- Service Business

RETAIL CONTENT

Show:

- Barcode sales
- Item groups
- Stock quantities
- Product variants
- Discounts
- Customer memberships

CAFÉ AND RESTAURANT CONTENT

Show:

- Fast ordering
- Counter or table sales
- Item options
- KHQR payments
- Order preparation flow

SERVICE BUSINESS CONTENT

Show:

- Service items
- Timed sessions
- Staff assignment
- Customer history
- Payment tracking

INTERACTION

Use:

- Accessible tab roles
- Arrow-key navigation
- Visible focus states
- Smooth opacity and position transition
- Different product preview for each business type

Do not build a heavy carousel.

DAY TIMELINE

Replace the current six-stage alternating timeline with four stages.

EYEBROW

Use:

“From open to close”

HEADING

Use:

“A complete business day with FluxiBiz”

SUPPORTING TEXT

Use:

“Open, sell, stay in control, and close with a clear record of the day.”

STAGE 1

Title:

“Open”

Body:

“Open the register, confirm starting cash, and view pending business tasks.”

STAGE 2

Title:

“Sell”

Body:

“Process counter and online orders, apply discounts, and accept payments.”

STAGE 3

Title:

“Control”

Body:

“Monitor stock levels, payment activity, orders, and staff access throughout the day.”

STAGE 4

Title:

“Close”

Body:

“Reconcile payments, review daily performance, and close the register with confidence.”

DESIGN

Use:

- One connected vertical timeline
- Four clear status nodes
- Alternating content only on desktop
- Normal stacked content on mobile
- Consistent product UI illustrations
- Reduced spacing between steps

Remove:

- Six disconnected cards
- Large empty vertical gaps
- Diagonal SVG connectors
- Unrelated generic PNG artwork
- Excessive hover scaling

SURFACES SECTION

Change the heading to:

“One connected system, designed for every side of the business”

DESCRIPTION

Use:

“The counter, customer storefront, and owner dashboard all work from the same business data.”

SURFACE 1

Kicker:

“Employees”

Title:

“Counter POS”

Body:

“A fast selling interface for finding items, creating orders, receiving payments, and generating receipts.”

SURFACE 2

Kicker:

“Customers”

Title:

“Online storefront”

Body:

“A customer-facing storefront with products, item groups, search, and ordering connected to the same business system.”

SURFACE 3

Kicker:

“Owners and managers”

Title:

“Owner dashboard”

Body:

“Sales, stock, customers, staff, payments, and reports available from desktop, tablet, or mobile.”

CRITICAL REQUIREMENT

Remove the remote Loyverse screenshot.

Use only:

- FluxiBiz screenshots
- Local FluxiBiz assets
- Designed FluxiBiz placeholder product mockups

Do not label “Cloud & mobile” as a primary product surface.

RELIABILITY SECTION

Create a section with a different background, preferably brand-soft or dark green.

EYEBROW

Use:

“Secure and dependable”

HEADING

Use:

“Built for the moments your business cannot afford to miss”

BENEFIT 1

Title:

“Secure access”

Body:

“Protect business accounts through secure authentication and controlled sessions.”

Icon:

`ShieldCheck`

BENEFIT 2

Title:

“Staff permissions”

Body:

“Control what owners, cashiers, stock managers, and staff can access.”

Icon:

`UserRoundCog`

BENEFIT 3

Title:

“Auditable records”

Body:

“Keep clear records of orders, payments, sales, and stock movements.”

Icon:

`ScrollText`

BENEFIT 4

Title:

“Connected data”

Body:

“Keep information consistent across the POS, storefront, dashboards, and order channels.”

Icon:

`RefreshCw`

Do not make technologies such as these the main content:

- Spring Boot
- PostgreSQL
- Keycloak
- MinIO
- Docker
- Next.js

Translate architecture into business benefits.

FAQ SECTION

Create an accessible accordion.

HEADING

Use:

“Questions before getting started”

Include:

1. What types of businesses can use FluxiBiz?
2. Can FluxiBiz manage both USD and KHR?
3. Does FluxiBiz support KHQR payments?
4. Can employees have different roles and permissions?
5. Can customers order through Telegram or Messenger?
6. Can I access FluxiBiz from a phone or tablet?
7. How does low-stock monitoring work?
8. Do I need special POS hardware?
9. How is my business data protected?

Use factual answers only.

Do not promise unfinished functionality.

FINAL CTA

Create a dark-green final CTA section.

HEADING

Use:

“Your counter is only the beginning.”

BODY

Use:

“Connect sales, payments, inventory, customers, staff, and reports in one business workspace.”

PRIMARY CTA

Use:

“Get started”

SECONDARY CTA

Use:

“Explore the product”

VISUAL

Show a connected sequence:

Storefront → Order → Payment → Inventory → Report

Use subtle animated connecting lines.

FOOTER

Create a structured footer.

PRODUCT

- Point of sale
- Inventory
- Storefront
- Reports

SOLUTIONS

- Retail
- Café & Restaurant
- Service Business

COMPANY

- About
- Contact

ACCOUNT

- Login
- Register

LEGAL

- Privacy
- Terms

Also include:

- FluxiBiz logo
- English and Khmer selector
- Theme toggle
- Real social links only
- Copyright year
- Small system indicator:
  - “All systems connected”

UI LIBRARY REQUIREMENTS

Preserve:

- shadcn/ui
- Existing Radix-based components
- Existing Tailwind design system

Continue using shadcn/ui for:

- Button
- Card
- Badge
- DropdownMenu
- Sheet
- Tabs
- Accordion
- Tooltip
- Popover
- Dialog

Do not introduce another component library.

Do not add:

- Material UI
- Ant Design
- Chakra UI
- Mantine
- Bootstrap
- DaisyUI
- Flowbite

Do not duplicate Radix primitives outside the existing shadcn/ui setup.

ICON LIBRARY

Continue using Lucide React as the primary icon library.

Do not introduce:

- React Icons
- Heroicons
- Phosphor Icons
- Font Awesome

Use one consistent icon style.

ANIMATION STRATEGY

Use the lightest suitable method.

Priority:

1. Tailwind transitions and transforms
2. Existing CSS keyframes
3. Existing `ScrollReveal`
4. Existing `Reveal`
5. Motion for React only for advanced interactive transitions

USE CSS OR EXISTING COMPONENTS FOR

- Button hover states
- Navigation underline
- Card border changes
- Image movement
- Status pulses
- Progress bars
- Small floating notifications
- Section entrance reveals
- Simple opacity transitions
- Simple translate transitions

Do not install an animation dependency for effects that CSS already handles.

MOTION FOR REACT

Motion for React may be added only when it clearly improves:

- Shared-layout transitions
- Business-type tab transitions
- Presence-based enter and exit
- Animated number changes
- Coordinated interactive states
- Swipe interaction

Use the current package:

- `motion`

Import React APIs from:

- `motion/react`

Do not install the older `framer-motion` package unless it already exists in the project.

Do not rewrite every `ScrollReveal` component using Motion.

Use clear responsibilities:

- `ScrollReveal`: section entrance
- `Reveal`: small content changes
- Tailwind and CSS: hover and micro-interactions
- Motion for React: advanced state transitions

HEAVY ANIMATION LIBRARIES

Do not add these during the initial update:

- GSAP
- ScrollTrigger
- Rive
- Three.js
- React Three Fiber
- Lottie
- Lenis
- AOS
- Anime.js
- Animate.css
- Locomotive Scroll

GSAP may only be considered later for a specifically approved pinned scroll-story that cannot be handled cleanly using the current stack.

SCROLLING

Keep native browser scrolling.

Do not add smooth-scroll libraries.

Use CSS scroll behavior only where appropriate.

Do not override normal browser scrolling.

CAROUSELS

Do not install a carousel library for simple content.

Prefer:

- Responsive grids
- Accessible tabs
- CSS scroll snap on mobile

Use Embla Carousel only if an actual carousel is approved.

Do not use Swiper for basic card layouts.

CHARTS

For product-preview charts, use:

- CSS bars
- Inline SVG
- Simple custom shapes

Do not install:

- Chart.js
- Recharts
- ApexCharts
- ECharts

for decorative landing-page charts.

IMAGE HANDLING

Continue using Next.js `Image`.

Use `EditableImage` where the current landing page expects editable product imagery.

Avoid standard `<img>` unless there is a valid technical reason.

Prefer local FluxiBiz assets.

Do not use:

- Competitor screenshots
- Unstable external image URLs
- Random stock photography when product UI can explain the feature

ANIMATION QUALITY RULES

Use motion to explain product behavior.

Recommended timing:

- 180–250ms for hover and focus
- 300–500ms for panels and content changes
- Spring transitions for notifications or interactive tab panels
- Movement distance around 8–24px
- Hover scale between `1.01` and `1.025`

Avoid:

- Scaling every card
- Continuous bouncing
- Excessive parallax
- Large rotations
- Animating every element simultaneously
- Long stagger delays
- Continuous off-screen animation
- Replaying animations on tiny scroll changes

Use varied interaction treatments:

- Border emphasis
- Background change
- Small shadow
- Image movement
- Content reveal
- Status transition

Do not give every card the same hover effect.

ACCESSIBILITY

Maintain:

- WCAG AA contrast
- Keyboard navigation
- Visible focus states
- Screen-reader labels
- Semantic headings
- Accessible tabs
- Accessible accordions
- Accessible dropdowns
- Meaningful image alt text

Respect:

`prefers-reduced-motion`

When reduced motion is enabled:

- Disable parallax
- Disable continuous floating
- Disable large movement
- Disable animated number transitions
- Show final states immediately
- Use simple opacity changes only where useful

PERFORMANCE

- Keep static sections as server components.
- Add `"use client"` only where state or browser APIs are required.
- Do not convert the full landing page into a client component.
- Lazy-load below-the-fold images.
- Keep hero assets optimized.
- Avoid autoplay video.
- Avoid animation loops that continuously update React state.
- Prefer opacity and transform.
- Avoid animating:
  - Width
  - Height
  - Top
  - Left
  - Large layout properties
- Prevent layout shifts.
- Do not load multiple libraries solving the same problem.
- Keep mobile performance as a priority.

DEPENDENCY APPROVAL RULE

Before adding any new library, first state:

1. Library name
2. Exact feature requiring it
3. Why the existing stack cannot implement the feature cleanly
4. Expected bundle-size or performance impact
5. Components that will use it

Do not install a new dependency before providing this justification.

For the first implementation pass, use only:

- Existing project dependencies
- Tailwind CSS
- shadcn/ui
- Lucide React
- Existing `ScrollReveal`
- Existing `Reveal`
- CSS keyframes
- Inline SVG

Motion for React may be added only for the approved `BusinessTypeSwitcher` transition or another clearly justified advanced interaction.

CONTENT RULES

Use “FluxiBiz” consistently.

Do not use “IPOS” in public-facing landing-page content.

Use “item” and “item group” inside product-management UI.

In marketing copy, “products and services” may be used when it is clearer for normal business users.

Do not use unsupported claims such as:

- AI features
- Automatic reorder
- Recipe-level inventory
- Multi-location management
- Zero data loss
- Free trial
- Real customer growth percentages
- Guaranteed revenue improvement

Clearly label example orders and values as demonstration data.

Do not modify:

- Backend logic
- API behavior
- Authentication behavior
- Application routes
- Existing navigation destinations

FIRST REQUIRED OUTPUT

Before writing implementation code, provide:

1. Components to modify
2. Components to remove
3. Components to create
4. Updated section order
5. Required local image assets
6. Unsupported content found in the current page
7. Libraries that will remain in use
8. Any proposed new dependency and its justification
9. Desktop design summary
10. Mobile design summary
11. Short implementation sequence

Do not write implementation code until this plan is reviewed and approved.
