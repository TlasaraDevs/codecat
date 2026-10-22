// Table: experience — dates are "YYYY-MM"; end_date null means ongoing.
// start_date may be null when unknown.
export const experience = [
  {
    id: 1,
    developer_slug: "codecat",
    organization: "International Livestock Research Institute (ILRI)",
    location: "Nairobi, Kenya",
    role: "IT Intern",
    department: "Customer Service",
    start_date: "2025-02",
    end_date: "2025-11",
    highlights: [
      "Provided front-line ICT support through ServiceDesk, triaging tickets and diagnosing hardware and software issues.",
      "Built Python automation tools that streamlined internal recertification processes.",
      "Handled data securely and documented incidents thoroughly.",
      "Supported system audits and internal reports aligned with digital evidence management.",
    ],
    sort_order: 1,
  },
  {
    id: 2,
    developer_slug: "codecat",
    organization: "United States International University – Africa (USIU-A)",
    location: "Nairobi, Kenya",
    role: "IT Attachee",
    department: "Service Delivery",
    start_date: "2023-01",
    end_date: "2023-04",
    highlights: [
      "Managed domain user accounts.",
      "Upgraded RAM in institution desktops.",
      "Provided printing support through MyQ.",
      "Maintained the institution's computers.",
      "Delivered remote and in-person software support.",
    ],
    sort_order: 2,
  },
  {
    id: 3,
    developer_slug: "codecat",
    organization: "Self-employed",
    location: "Remote",
    role: "Freelance Web Developer",
    department: "",
    start_date: null,
    end_date: null,
    highlights: [
      "Designing and building websites for clients, including the Zarason e-commerce store (ongoing).",
    ],
    sort_order: 0,
  },
];
