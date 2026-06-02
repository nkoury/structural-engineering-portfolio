window.PORTFOLIO_PROJECTS = [
  {
    id: "steel-frame-adaptive-reuse",
    title: "Steel Frame Adaptive Reuse",
    type: "Building Structure",
    year: "2026",
    initials: "SF",
    summary:
      "A case-study slot for gravity framing, lateral bracing, existing-condition constraints, and coordinated drawing details.",
    tags: ["Steel", "Existing Conditions", "FEA", "Construction Docs"],
    color: "#1b7b77",
    assetFolder: "assets/project-assets/steel-frame-adaptive-reuse/",
    sourceAssets: ["U3D/PDF model", "Drawing plan crops", "FEA screenshots", "Hand calculation excerpts"],
    tabs: {
      Overview:
        "Use this section to describe the client problem, building constraints, governing loads, your role, and the decisions you owned.",
      Model:
        "Add U3D/PDF references for documentation and a browser-native GLB/GLTF, model screenshot, or short turntable video for display.",
      Drawings:
        "Show cropped plan sheets, sections, connection details, revision clouds, and before/after coordination markups.",
      Analysis:
        "Display FEA contours, deflection checks, member demand summaries, drift notes, or reaction/load path diagrams.",
      Calculations:
        "Use selected hand calculation excerpts with sensitive numbers, project names, and stamps removed."
    },
    bullets: [
      "Frame stabilization and load path review",
      "Plan/detail coordination with architectural constraints",
      "Member checks supported by calculation excerpts"
    ]
  },
  {
    id: "equipment-platform",
    title: "Industrial Equipment Platform",
    type: "Industrial",
    year: "2025",
    initials: "EP",
    summary:
      "A template for platform framing, equipment loads, vibration/deflection criteria, connection strategy, and fabrication-ready drawings.",
    tags: ["Platform", "Equipment Loads", "Vibration", "Details"],
    color: "#b65f3a",
    assetFolder: "assets/project-assets/equipment-platform/",
    sourceAssets: ["Model export", "Equipment load diagram", "Detail crops", "Design check excerpts"],
    tabs: {
      Overview:
        "Summarize the equipment, support criteria, serviceability requirements, access constraints, and coordination boundaries.",
      Model:
        "Add model views that isolate primary members, bracing, base plates, and equipment load application points.",
      Drawings:
        "Show plan crops, section cuts, connection details, and shop coordination notes.",
      Analysis:
        "Present load cases, envelope diagrams, reaction checks, deflection/vibration criteria, and model assumptions.",
      Calculations:
        "Include selected calc pages for beam sizing, base plate checks, anchorage, and serviceability."
    },
    bullets: [
      "Equipment load introduction and support framing",
      "Serviceability-focused checks",
      "Fabrication-oriented detail communication"
    ]
  },
  {
    id: "foundation-retrofit",
    title: "Foundation Retrofit Study",
    type: "Assessment",
    year: "2024",
    initials: "FR",
    summary:
      "A structure for showing observation notes, retrofit options, analysis assumptions, and clear recommendations.",
    tags: ["Retrofit", "Foundations", "Field Review", "Calculations"],
    color: "#445c43",
    assetFolder: "assets/project-assets/foundation-retrofit/",
    sourceAssets: ["Field photos", "Retrofit sketches", "Plan markups", "Calculation excerpts"],
    tabs: {
      Overview:
        "Describe existing conditions, observed distress, design basis, investigation limits, and recommendation criteria.",
      Model:
        "Use simplified diagrams or model views to communicate load transfer and proposed reinforcing strategy.",
      Drawings:
        "Show redacted field sketches, repair details, plan callouts, and phased work notes.",
      Analysis:
        "Present bearing checks, demand comparisons, soil/support assumptions, and option screening.",
      Calculations:
        "Add calc excerpts for footing demand, anchor design, reinforcing checks, or load redistribution."
    },
    bullets: [
      "Existing-condition documentation",
      "Retrofit option comparison",
      "Clear recommendation backed by calcs"
    ]
  }
];
