# RIDELINE — Motorcycle Showroom Website

**Student Name:** Jesper Sev V. Murao  
**Website Category:** Business / Motorcycle Showroom

## Project Description
RIDELINE is a responsive motorcycle showroom website where users can browse motorcycle models, view specifications, save favorites, compare motorcycles, and submit an inquiry.

## Pages and Sections
- **Home** — introduces RIDELINE and highlights selected motorcycles.
- **Motorcycles** — displays motorcycle cards with search, category filters, and a details modal.
- **Compare Motorcycles** — compares specifications for two selected motorcycles.
- **Send Inquiry** — validates and processes a sample motorcycle inquiry in the browser.
- **Rider's Garage** — saves and removes favorite motorcycles.
- **About** — explains the website's purpose and features.

## Main Features
- Responsive layout and mobile navigation
- Motorcycle catalog with local images, prices, model years, and categories
- Search and category filtering
- Motorcycle details modal
- Add/remove favorites using Local Storage
- Comparison of exactly two motorcycles
- Inquiry form with required-field and input validation
- Motorcycle data loaded from JSON using Fetch API
- Simulated asynchronous inquiry submission

## Technologies Used
- HTML
- CSS
- JavaScript
- JSON
- Fetch API
- Local Storage
- VS Code Live Server

## How to Run
1. Extract the project ZIP.
2. Open the extracted project folder in Visual Studio Code.
3. Run `index.html` using the Live Server extension.
4. Use the navigation to explore the pages and test the features.

**Note:** Use Live Server so Fetch API can load `data/motorcycles.json`. Inquiry submission is a front-end demonstration; it does not send an email or notify a real dealer.

## Data Storage
- `ridelineGarage` stores saved motorcycle IDs.
- `ridelineCompare` stores up to two selected motorcycle IDs.
- `data/motorcycles.json` contains the motorcycle catalog and specifications.

## Project Documentation
Include screenshots of each website page or major section in the project documentation and GitHub repository.
