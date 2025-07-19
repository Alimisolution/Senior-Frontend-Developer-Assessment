# Senior Front-End Technical Assessment

## Overview

The goal of this assessment is to evaluate your ability to design and implement a modern, performant, and user-friendly single-page application using **React** with **Vite**, **Material UI**, and **OpenLayers**. You are expected to demonstrate best practices in modular code structure, state management, UI/UX consistency, and responsiveness.

---

## Stack Requirements

- React (with Vite for project scaffolding)
- Material UI (MUI) for UI components
- OpenLayers for map rendering
- React Hook Form for form management (recommended)
- Mocked API interaction using `setTimeout`

---

## Functional Requirements

### 1. Application Initialization

- On initial load, a modal should be open by default.
- The modal contains a filter form with the following fields:

  - **Date From** (default: 5 years ago from today)
  - **Date To** (default: today)
  - **Company** (multi-select, default: `Company 1`)
  - **Vessel** (single-select, use dummy data for each company)
  - **Hull Jobs** (multi-select)

![Global Filters Example](./assets/global_filters.png)

#### Company List

```ts
const companyList = [
  { id: "cmp2", label: "Company 1" },
  { id: "cmp1", label: "Company 2" },
  { id: "cmp3", label: "Company 3" },
];
```

#### Hull Jobs List

```ts
const hullJobs = [
  { id: "03573a58-6a32-4433-9e1a-9f9d31c71edb", label: "Hull Inspection (HI)" },
  {
    id: "b10dd87b-68b4-496d-9b60-39cf9f03c0bb",
    label: "Propeller Polish (PP)",
  },
  { id: "ee828f1f-f1cd-4962-a980-12ccc4e48e7b", label: "Hull Cleaning (HC)" },
  {
    id: "3a95d310-64bc-4599-8c4d-9304d12bb986",
    label: "Propeller Inspection (PI)",
  },
  { id: "c854b265-067c-4b7a-8d6a-d00f7304297b", label: "Drydock (DD)" },
];
```

### 2. Form Submission

- Simulate a `POST` request using a `setTimeout` of 5 seconds.
- On successful submission:

  - Close the modal
  - Show a success `Snackbar` notification in the top-right
  - Display appropriate UI states for loading, error, and no-data scenarios

- When reopened, the modal should retain previously submitted filter values

#### Example Request Payload

```json
{
  "company": ["cmp1"],
  "dateFrom": "2020-07-08",
  "dateTo": "2025-07-08",
  "hullJobs": ["1", "4", "2"]
}
```

---

### 3. Main View After Submission

![Global Filters Example](./assets/dark_mode.png)

Once the modal is successfully submitted, display the main view consisting of:

#### a. Map View (Left Panel)

- Render a vessel trail using **OpenLayers** and data from `mockData.json`
- Map features must include:

  - Zooming and panning
  - Plotting trail positions
  - Connecting positions via a line
  - Tooltips on hover showing:

    - `timestamp`
    - `power` (Corrected Power)
    - `consumption` (Excess Consumption)
    - `logSpeed`
    - `waveHeight`
    - `windSpeed`

    ![Map Hover Tooltip](./assets/map_hover_tooltip.png)

#### b. Trail Color-Coding

- Include a dropdown to change trail color based on one of the following metrics:

  - None (default)
  - Excess Consumption (`consumption`)
  - Power (`power`)
  - SFOC (`sfoc`) – only if `sfocVisible === true` in the data

![Trail Coloring Dropdown](./assets/trail_coloring_dropdown.png)

##### Color Mapping Logic

| Filter             | Color   | Metric Min | Metric Max |
| ------------------ | ------- | ---------- | ---------- |
| Default            | #0000FF | -          | -          |
| Power              | #00FF00 | NULL       | 106        |
| Power              | #FFAC1C | 106        | 114        |
| Power              | #FF0000 | 114        | NULL       |
| SFOC               | #00FF00 | NULL       | 103        |
| SFOC               | #FFAC1C | 103        | 110        |
| SFOC               | #FF0000 | 110        | NULL       |
| Excess Consumption | #00FF00 | NULL       | 5          |
| Excess Consumption | #FFAC1C | 5          | 15         |
| Excess Consumption | #FF0000 | 15         | NULL       |

![Trail Coloring Example](./assets/trail_coloring_sample.png)

#### c. Info Cards (Right Panel)

- Display **4 information cards** using mock data
  - Paint
  - Hull Roughness
  - Log Factor
  - Last Underwater
- Ensure a clean and modular layout

## ![Info Cards Example](./assets/info_cards.png)

### 4. UI Header

Place the following two icon buttons in the top-right corner:

1. **Open Filter Modal** (reopens the modal - example shared above)
2. **Theme Toggle** (switches between light and dark modes)

## ![Light Mode View](./assets/light_mode.png)

## Additional Notes

- Properly handle empty data, loading states, and any simulated errors.
- Use modular, maintainable code with appropriate abstraction.
- Add comments where necessary to improve code readability.

---

## Deliverables

Please create a **public GitHub repository** containing the following:

- Complete source code of the application
- A `README.md` file including:

  - Installation instructions
  - How to run the application locally

- Clean and modular code structure following best practices

---

## Evaluation Criteria

- Code quality and modularity
- UI/UX consistency and responsiveness
- React, Vite, and MUI usage
- Proper implementation of OpenLayers and form logic
- Attention to detail (e.g., theme toggle, tooltip accuracy, trail coloring)
- Error handling and state management
