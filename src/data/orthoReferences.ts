export interface OrthoParameterRef {
  id: string;
  name: string;
  category: string;
  mean: number | string;
  range?: string;
  maleMean?: number;
  femaleMean?: number;
  unit: 'mm' | 'degrees' | '%' | 'ratio' | 'unitless';
  formula?: string;
  source: string;
  whatIsIt: string;
  clinicalRelevance: string;
}

export const CVM_STAGES_INFO = {
  1: {
    name: 'CS1 – Initiation',
    description: 'Inferior borders of C2, C3, and C4 are all flat. Bodies of C3 and C4 are trapezoid in shape.',
    growthStatus: 'Peak mandibular growth will occur on average 2 years after this stage.',
    remainingGrowth: 'Approximately 80–100% of adolescent growth remaining.',
    clinicalCorrelation: 'Ideal period for preliminary orthopedic maxillary expansion; mandibular functional appliances are premature.'
  },
  2: {
    name: 'CS2 – Acceleration',
    description: 'Concavity is present at the inferior border of C2. Inferior borders of C3 and C4 remain flat. Bodies of C3 and C4 are trapezoid.',
    growthStatus: 'Mandibular growth peak will occur on average 1 year after this stage.',
    remainingGrowth: 'Approximately 65–85% of adolescent growth remaining.',
    clinicalCorrelation: 'Approaching peak growth velocity. Excellent timing for preparatory orthopedic therapies.'
  },
  3: {
    name: 'CS3 – Transition',
    description: 'Concavities are present at the inferior borders of both C2 and C3. Inferior border of C4 is flat. Bodies of C3 and C4 are trapezoid or horizontally rectangular.',
    growthStatus: 'Mandibular growth peak occurs during the year following this stage.',
    remainingGrowth: 'Peak velocity stage! High remaining growth potential.',
    clinicalCorrelation: 'Optimal timing to initiate functional appliance therapy (e.g., Twin Block, Herbst) for Class II skeletal correction.'
  },
  4: {
    name: 'CS4 – Deceleration',
    description: 'Concavities are present at the inferior borders of C2, C3, and C4. Bodies of C3 and C4 are horizontally rectangular.',
    growthStatus: 'Mandibular growth peak has just decelerated (occurred 1–2 years prior).',
    remainingGrowth: 'Approximately 10–25% remaining adolescent growth.',
    clinicalCorrelation: 'Window for functional orthopedic skeletal modification is closing; focus shifts to comprehensive fixed appliances and settling.'
  },
  5: {
    name: 'CS5 – Maturation',
    description: 'Concavities prominent on C2, C3, and C4. At least one of the bodies of C3 or C4 is square in shape.',
    growthStatus: 'Substantial adolescent growth has concluded.',
    remainingGrowth: 'Minimal remaining growth (<10%).',
    clinicalCorrelation: 'Skeletal changes largely finished. Orthodontic camouflage or retention; orthognathic surgery planning if severe skeletal discrepancy.'
  },
  6: {
    name: 'CS6 – Completion',
    description: 'Concavities deepened on C2, C3, and C4. At least one body of C3 or C4 is vertically rectangular (vertical height greater than horizontal depth).',
    growthStatus: 'Adolescent craniofacial growth is complete.',
    remainingGrowth: 'Negligible remaining growth (adult status).',
    clinicalCorrelation: 'Full skeletal maturity reached. Surgical orthodontic correction if skeletal discrepancy cannot be masked dentally.'
  }
};

export const CEPH_REFERENCES: Record<string, OrthoParameterRef> = {
  // DOWNS SKELETAL
  downs_facialAngle: {
    id: 'downs_facialAngle',
    name: 'Facial Angle (FH to N-Pog)',
    category: "Down's Skeletal",
    mean: 87.8,
    range: '82° to 95°',
    unit: 'degrees',
    source: "Downs WB (1948) / Case History Format",
    whatIsIt: 'Angle formed between the Frankfort Horizontal plane and the Facial Plane (N-Pog).',
    clinicalRelevance: 'Quantifies anterior-posterior mandibular positioning. Values >95° indicate mandibular protrusion; <82° indicate mandibular retrusion.'
  },
  downs_angleOfConvexity: {
    id: 'downs_angleOfConvexity',
    name: 'Angle of Convexity (N-A-Pog)',
    category: "Down's Skeletal",
    mean: 0,
    range: '-8.5° to +10°',
    unit: 'degrees',
    source: "Downs WB (1948) / Case History Format",
    whatIsIt: 'Angle between N-A line and A-Pog line (measured as deviation from 180° straight line).',
    clinicalRelevance: 'Evaluates skeletal profile convexity. Positive values reflect maxillary prominence or retrognathic mandible (Class II tendency); negative values reflect skeletal Class III tendency.'
  },
  downs_abPlane: {
    id: 'downs_abPlane',
    name: 'A-B Plane to Facial Plane',
    category: "Down's Skeletal",
    mean: -4.6,
    range: '-9° to 0°',
    unit: 'degrees',
    source: "Downs WB (1948) / Case History Format",
    whatIsIt: 'Angle formed between the A-B plane and the N-Pog facial plane.',
    clinicalRelevance: 'Assesses the sagittal apical base relationship relative to the facial plane. More negative values indicate Class II relationship; positive values indicate Class III.'
  },
  downs_mandibularPlaneAngle: {
    id: 'downs_mandibularPlaneAngle',
    name: 'Mandibular Plane Angle (FMA)',
    category: "Down's Skeletal",
    mean: 21.9,
    range: '17° to 28°',
    unit: 'degrees',
    source: "Downs WB (1948) / Case History Format",
    whatIsIt: 'Angle formed between Frankfort Horizontal (FH) and the Mandibular Plane (Go-Me / tangent to lower border).',
    clinicalRelevance: 'Vertical facial growth indicator. High angles (>28°) indicate hyperdivergent/open-bite growth; low angles (<17°) indicate hypodivergent/deep-bite pattern.'
  },
  downs_yAxis: {
    id: 'downs_yAxis',
    name: 'Y-Axis (SGn to FH)',
    category: "Down's Skeletal",
    mean: 59.4,
    range: '53° to 66°',
    unit: 'degrees',
    source: "Downs WB (1948) / Case History Format",
    whatIsIt: 'Acute angle formed by the line from Sella to Gnathion (S-Gn) with Frankfort Horizontal.',
    clinicalRelevance: 'Direction of mandibular growth. Larger angles indicate downward and backward vertical growth; smaller angles indicate forward horizontal growth.'
  },

  // DOWNS DENTAL
  downs_cantOfOcclusalPlane: {
    id: 'downs_cantOfOcclusalPlane',
    name: 'Cant of Occlusal Plane',
    category: "Down's Dental",
    mean: 9.3,
    range: '1.5° to 14°',
    unit: 'degrees',
    source: "Downs WB (1948) / Case History Format",
    whatIsIt: 'Angle formed between the occlusal plane and Frankfort Horizontal.',
    clinicalRelevance: 'Represents the tilt of the occlusal plane relative to cranial reference.'
  },
  downs_oneToOne: {
    id: 'downs_oneToOne',
    name: 'Interincisal Angle (U1 to L1)',
    category: "Down's Dental",
    mean: 135.4,
    range: '130° to 150.5°',
    unit: 'degrees',
    source: "Downs WB (1948) / Case History Format",
    whatIsIt: 'Angle between long axes of upper and lower central incisors.',
    clinicalRelevance: 'Reduced angle (<130°) indicates bimaxillary dental protrusion; increased angle (>150°) indicates retroclination / deep bite tendency (as in Class II div 2).'
  },
  downs_oneToOcclusalPlane: {
    id: 'downs_oneToOcclusalPlane',
    name: 'L1 to Occlusal Plane',
    category: "Down's Dental",
    mean: 14.5,
    range: '3.5° to 20°',
    unit: 'degrees',
    source: "Downs WB (1948) / Case History Format",
    whatIsIt: 'Complement of the inferior inside angle between lower incisor long axis and occlusal plane.',
    clinicalRelevance: 'Measures lower incisor tilt relative to the occlusal table.'
  },
  downs_oneToMandibularPlane: {
    id: 'downs_oneToMandibularPlane',
    name: 'L1 to Mandibular Plane (IMPA)',
    category: "Down's Dental",
    mean: 91.4,
    range: '81.5° to 97°',
    unit: 'degrees',
    source: "Downs WB (1948) / Case History Format",
    whatIsIt: 'Inside angle between lower central incisor long axis and mandibular plane.',
    clinicalRelevance: 'Determines lower incisor proclination (>97°) or retroclination (<81.5°).'
  },
  downs_oneToAPog: {
    id: 'downs_oneToAPog',
    name: 'L1 to A-Pog line (mm)',
    category: "Down's Dental",
    mean: 2.7,
    range: '-1 to +5 mm',
    unit: 'mm',
    source: "Downs WB (1948) / Case History Format",
    whatIsIt: 'Linear distance from incisal edge of lower incisor to A-Pogonion line.',
    clinicalRelevance: 'Evaluates lower incisor position relative to the anterior dentofacial limit.'
  },

  // STEINER
  steiner_sna: {
    id: 'steiner_sna',
    name: 'SNA',
    category: 'Steiner Skeletal',
    mean: 82.0,
    range: '80° to 84°',
    unit: 'degrees',
    source: "Steiner CC (1953) / Case History Format",
    whatIsIt: 'Angle between Sella-Nasion line and Nasion-Point A line.',
    clinicalRelevance: 'Indicates anteroposterior position of the maxilla relative to anterior cranial base. >84° maxillary prognathism; <80° maxillary retrognathism.'
  },
  steiner_snb: {
    id: 'steiner_snb',
    name: 'SNB',
    category: 'Steiner Skeletal',
    mean: 80.0,
    range: '78° to 82°',
    unit: 'degrees',
    source: "Steiner CC (1953) / Case History Format",
    whatIsIt: 'Angle between Sella-Nasion line and Nasion-Point B line.',
    clinicalRelevance: 'Indicates anteroposterior position of mandible relative to cranial base. >82° mandibular prognathism; <78° mandibular retrognathism.'
  },
  steiner_snd: {
    id: 'steiner_snd',
    name: 'SND',
    category: 'Steiner Skeletal',
    mean: 76.0,
    range: '74° to 78°',
    unit: 'degrees',
    source: "Steiner CC (1953) / Case History Format",
    whatIsIt: 'Angle from S-N line to center of mandibular symphysis (Point D).',
    clinicalRelevance: 'Unbiased assessment of bony mandibular chin position unaffected by alveolar remodelling.'
  },
  steiner_anb: {
    id: 'steiner_anb',
    name: 'ANB',
    category: 'Steiner Skeletal',
    mean: 2.0,
    range: '0° to 4°',
    unit: 'degrees',
    source: "Steiner CC (1953) / Case History Format",
    whatIsIt: 'Difference between SNA and SNB (SNA - SNB).',
    clinicalRelevance: 'Key sagittal skeletal jaw discrepancy. Normal: 2° (0-4°); >4° skeletal Class II tendency; <0° skeletal Class III tendency. Note: Influenced by nasion position and cranial base inclination.'
  },
  steiner_goGnToSN: {
    id: 'steiner_goGnToSN',
    name: 'Go-Gn to SN',
    category: 'Steiner Skeletal',
    mean: 32.0,
    range: '27° to 37°',
    unit: 'degrees',
    source: "Steiner CC (1953) / Case History Format",
    whatIsIt: 'Angle formed between Gonion-Gnathion mandibular plane and Sella-Nasion plane.',
    clinicalRelevance: 'Assesses mandibular steepness and vertical divergence pattern. High (>37°) = high angle / hyperdivergent; low (<27°) = low angle / hypodivergent.'
  },
  steiner_u1ToNA_mm: {
    id: 'steiner_u1ToNA_mm',
    name: 'U1 to NA (mm)',
    category: 'Steiner Dental',
    mean: 4.0,
    range: '2 to 6 mm',
    unit: 'mm',
    source: "Steiner CC (1953) / Case History Format",
    whatIsIt: 'Perpendicular linear distance from labial surface of upper incisor crown to N-A line.',
    clinicalRelevance: 'Evaluates linear prominence of upper incisors. >6 mm = protrusive; <2 mm = retrusive.'
  },
  steiner_u1ToNA_deg: {
    id: 'steiner_u1ToNA_deg',
    name: 'U1 to NA (angle)',
    category: 'Steiner Dental',
    mean: 22.0,
    range: '18° to 26°',
    unit: 'degrees',
    source: "Steiner CC (1953) / Case History Format",
    whatIsIt: 'Angle between upper incisor long axis and N-A line.',
    clinicalRelevance: 'Evaluates angular inclination of upper incisors. >26° proclined; <18° retroclined.'
  },
  steiner_l1ToNB_mm: {
    id: 'steiner_l1ToNB_mm',
    name: 'L1 to NB (mm)',
    category: 'Steiner Dental',
    mean: 4.0,
    range: '2 to 6 mm',
    unit: 'mm',
    source: "Steiner CC (1953) / Case History Format",
    whatIsIt: 'Linear distance from labial surface of lower incisor crown to N-B line.',
    clinicalRelevance: 'Evaluates linear prominence of lower incisors.'
  },
  steiner_l1ToNB_deg: {
    id: 'steiner_l1ToNB_deg',
    name: 'L1 to NB (angle)',
    category: 'Steiner Dental',
    mean: 25.0,
    range: '20° to 30°',
    unit: 'degrees',
    source: "Steiner CC (1953) / Case History Format",
    whatIsIt: 'Angle between lower incisor long axis and N-B line.',
    clinicalRelevance: 'Evaluates angular inclination of lower incisors. >30° proclined; <20° retroclined.'
  },
  steiner_pogToNB_mm: {
    id: 'steiner_pogToNB_mm',
    name: 'Pog to NB (mm)',
    category: 'Steiner Dental/Skeletal',
    mean: 4.0,
    range: '2 to 6 mm',
    unit: 'mm',
    source: "Steiner CC (1953) / Case History Format",
    whatIsIt: 'Distance from bony Pogonion to N-B line (chin prominence).',
    clinicalRelevance: 'Used in Holdaway ratio (L1-NB mm : Pog-NB mm, ideally 1:1) to evaluate lower incisor-chin balance.'
  },
  steiner_u1ToL1_deg: {
    id: 'steiner_u1ToL1_deg',
    name: 'U1 to L1 (Interincisal angle)',
    category: 'Steiner Dental',
    mean: 131.0,
    range: '125° to 137°',
    unit: 'degrees',
    source: "Steiner CC (1953) / Case History Format",
    whatIsIt: 'Angle between upper and lower incisor axes in Steiner analysis.',
    clinicalRelevance: 'Reduced angle (<125°) indicates proclination/bimaxillary protrusion; increased angle (>137°) indicates deep bite / retroclination.'
  },
  steiner_occlusalToSN: {
    id: 'steiner_occlusalToSN',
    name: 'Occlusal Plane to SN',
    category: 'Steiner Skeletal/Dental',
    mean: 14.0,
    range: '10° to 18°',
    unit: 'degrees',
    source: "Steiner CC (1953) / Case History Format",
    whatIsIt: 'Angle between functional occlusal plane and S-N plane.',
    clinicalRelevance: 'Steeper occlusal planes often correlate with high-angle skeletal tendencies.'
  },

  // WITS
  wits_diff: {
    id: 'wits_diff',
    name: 'Wits Appraisal (BO - AO)',
    category: 'Wits Appraisal',
    mean: 'Male: -1 mm | Female: 0 mm',
    range: '-3 to +1 mm',
    unit: 'mm',
    source: "Jacobson A (1975) / Case History Format",
    whatIsIt: 'Linear distance along occlusal plane between perpendiculars dropped from Point A (AO) and Point B (BO).',
    clinicalRelevance: 'Independent of cranial base rotational variations. When BO is notably behind AO (positive difference in some conventions, or AO ahead of BO by >2mm), indicates Class II; BO ahead of AO indicates Class III.'
  },

  // TWEED
  tweed_fmpa: {
    id: 'tweed_fmpa',
    name: 'FMPA (Frankfort Mandibular Plane Angle)',
    category: 'Tweed Analysis',
    mean: 25.0,
    range: '22° to 28°',
    unit: 'degrees',
    source: "Tweed CH (1954) / Case History Format",
    whatIsIt: 'Angle between Frankfort Horizontal (FH) and mandibular plane.',
    clinicalRelevance: 'Vertical facial divergence. Values >30° indicate unfavorable hyperdivergence with weak chin projection.'
  },
  tweed_fmia: {
    id: 'tweed_fmia',
    name: 'FMIA (Frankfort Mandibular Incisor Angle)',
    category: 'Tweed Analysis',
    mean: 65.0,
    range: '62° to 68°',
    unit: 'degrees',
    source: "Tweed CH (1954) / Case History Format",
    whatIsIt: 'Angle formed between lower central incisor long axis and Frankfort Horizontal.',
    clinicalRelevance: 'Tweed considered 65° essential for good facial harmony and stable lower incisors over basal bone.'
  },
  tweed_impa: {
    id: 'tweed_impa',
    name: 'IMPA (Incisor Mandibular Plane Angle)',
    category: 'Tweed Analysis',
    mean: 90.0,
    range: '85° to 95°',
    unit: 'degrees',
    source: "Tweed CH (1954) / Case History Format",
    whatIsIt: 'Angle between lower incisor long axis and mandibular plane.',
    clinicalRelevance: 'Triangle formula: FMPA + FMIA + IMPA = 180°. Values >90° indicate lower incisor proclination beyond Tweed ideal.'
  },

  // MCNAMARA
  mcnamara_nPerpToA: {
    id: 'mcnamara_nPerpToA',
    name: 'N perpendicular to Point A',
    category: 'McNamara Skeletal',
    mean: 0.0,
    range: '-1 to +2 mm',
    unit: 'mm',
    source: "McNamara JA (1984) / Case History Format",
    whatIsIt: 'Linear distance from Nasion perpendicular line to Point A.',
    clinicalRelevance: 'Maxillary skeletal sagittal position. In mixed dentition mean is 0 mm; in adults ~1 mm. Negative values = maxillary skeletal retrusion; >+3 mm = maxillary skeletal protrusion.'
  },
  mcnamara_nPerpToPog: {
    id: 'mcnamara_nPerpToPog',
    name: 'N perpendicular to Pogonion',
    category: 'McNamara Skeletal',
    mean: -2.0,
    range: '-6 to 0 mm',
    unit: 'mm',
    source: "McNamara JA (1984) / Case History Format",
    whatIsIt: 'Linear distance from Nasion perpendicular line to Pogonion.',
    clinicalRelevance: 'Mandibular skeletal sagittal position. In adults, pogonion lies 0 to -2 mm behind N-perp. Larger negative numbers indicate mandibular retrognathia.'
  },
  mcnamara_effMaxillaryLength: {
    id: 'mcnamara_effMaxillaryLength',
    name: 'Effective Maxillary Length (Co - Point A)',
    category: 'McNamara Skeletal',
    mean: 90.0,
    range: '85 to 100 mm (age-dependent)',
    unit: 'mm',
    source: "McNamara JA (1984) / Case History Format",
    whatIsIt: 'Linear distance from Condylion to Point A.',
    clinicalRelevance: 'Used alongside effective mandibular length to calculate the maxillomandibular differential.'
  },
  mcnamara_effMandibularLength: {
    id: 'mcnamara_effMandibularLength',
    name: 'Effective Mandibular Length (Co - Gn)',
    category: 'McNamara Skeletal',
    mean: 115.0,
    range: '105 to 130 mm (age-dependent)',
    unit: 'mm',
    source: "McNamara JA (1984) / Case History Format",
    whatIsIt: 'Linear distance from Condylion to anatomical Gnathion.',
    clinicalRelevance: 'Total anatomical length of the mandible.'
  },
  mcnamara_diff: {
    id: 'mcnamara_diff',
    name: 'Maxillomandibular Differential',
    category: 'McNamara Skeletal',
    mean: 25.0,
    range: '20 to 30 mm (medium-large sizes)',
    unit: 'mm',
    source: "McNamara JA (1984) / Case History Format",
    whatIsIt: 'Effective Mandibular Length minus Effective Maxillary Length.',
    clinicalRelevance: 'Norm ranges from 20-23 mm in small individuals, up to 27-30 mm in large adults. Smaller differential suggests mandibular deficiency; larger suggests mandibular excess.'
  },
  mcnamara_lafh: {
    id: 'mcnamara_lafh',
    name: 'Lower Anterior Facial Height (ANS - Me)',
    category: 'McNamara Vertical',
    mean: 65.0,
    range: '60 to 70 mm (sex/size-dependent)',
    unit: 'mm',
    source: "McNamara JA (1984) / Case History Format",
    whatIsIt: 'Linear vertical distance between Anterior Nasal Spine and Menton.',
    clinicalRelevance: 'Increased LAFH indicates vertical maxillary excess / hyperdivergence; decreased LAFH indicates deep bite / hypodivergence.'
  },
  mcnamara_upperAirway: {
    id: 'mcnamara_upperAirway',
    name: 'Upper Airway Width',
    category: 'McNamara Pharyngeal',
    mean: 17.5,
    range: '15 to 20 mm',
    unit: 'mm',
    source: "McNamara JA (1984) / Case History Format",
    whatIsIt: 'Narrowest airway space from posterior pharyngeal wall to soft palate outline.',
    clinicalRelevance: '<15 mm indicates potential upper pharyngeal constriction or adenoid hypertrophy.'
  },
  mcnamara_lowerAirway: {
    id: 'mcnamara_lowerAirway',
    name: 'Lower Airway Width',
    category: 'McNamara Pharyngeal',
    mean: 12.0,
    range: '11 to 14 mm',
    unit: 'mm',
    source: "McNamara JA (1984) / Case History Format",
    whatIsIt: 'Narrowest airway space at the level of the posterior tongue margin.',
    clinicalRelevance: '<10 mm indicates potential hypopharyngeal airway compromise.'
  },

  // JARABAK
  jarabak_saddleAngle: {
    id: 'jarabak_saddleAngle',
    name: 'Saddle Angle (N-S-Ar)',
    category: 'Rakosi-Jarabak',
    mean: 123.0,
    range: '120° to 126°',
    unit: 'degrees',
    source: "Jarabak JR & Fizzell JA (1972) / Case History Format",
    whatIsIt: 'Angle formed between anterior and posterior cranial base lines (N-S and S-Ar).',
    clinicalRelevance: 'Larger angle carries TMJ/glenoid fossa backward and upward, contributing to retrognathic mandible.'
  },
  jarabak_articularAngle: {
    id: 'jarabak_articularAngle',
    name: 'Articular Angle (S-Ar-Go)',
    category: 'Rakosi-Jarabak',
    mean: 143.0,
    range: '140° to 146°',
    unit: 'degrees',
    source: "Jarabak JR & Fizzell JA (1972) / Case History Format",
    whatIsIt: 'Angle formed between S-Ar and Ar-Go.',
    clinicalRelevance: 'Subject to orthodontic influence during orthopedic growth modification or bite jumping.'
  },
  jarabak_gonialAngle: {
    id: 'jarabak_gonialAngle',
    name: 'Gonial Angle (Ar-Go-Me)',
    category: 'Rakosi-Jarabak',
    mean: 130.0,
    range: '125° to 135°',
    unit: 'degrees',
    source: "Jarabak JR & Fizzell JA (1972) / Case History Format",
    whatIsIt: 'Angle between posterior ramus border and lower mandibular border.',
    clinicalRelevance: 'Divided into upper (Ar-Go-N: 52-55°) and lower (N-Go-Me: 70-75°) parts. Upper indicates ramus growth tilt; lower indicates horizontal vs vertical chin rotation.'
  },
  jarabak_sumOfAngles: {
    id: 'jarabak_sumOfAngles',
    name: 'Sum of Posterior Angles (Saddle + Articular + Gonial)',
    category: 'Rakosi-Jarabak',
    mean: 396.0,
    range: '390° to 402° (396° ± 6°)',
    unit: 'degrees',
    source: "Jarabak JR & Fizzell JA (1972) / Case History Format",
    whatIsIt: 'Sum of N-S-Ar + S-Ar-Go + Ar-Go-Me.',
    clinicalRelevance: '>402° = Clockwise growth pattern / hyperdivergent / open bite tendency; <390° = Counter-clockwise growth pattern / hypodivergent / deep bite.'
  },
  jarabak_ratio: {
    id: 'jarabak_ratio',
    name: 'Jarabak Ratio (S-Go / N-Me × 100)',
    category: 'Rakosi-Jarabak',
    mean: 63.5,
    range: '62% to 65%',
    unit: '%',
    source: "Jarabak JR & Fizzell JA (1972) / Case History Format",
    whatIsIt: 'Ratio of posterior facial height (S-Go) to anterior facial height (N-Me) multiplied by 100.',
    clinicalRelevance: '>65% = Counter-clockwise / hypodivergent (anterior growth); <62% = Clockwise / hyperdivergent (vertical growth).'
  },

  // RICKETTS
  ricketts_facialAxis: {
    id: 'ricketts_facialAxis',
    name: 'Facial Axis Angle (Pt-Gn to Ba-N)',
    category: 'Ricketts Analysis',
    mean: 90.0,
    range: '87° to 93°',
    unit: 'degrees',
    source: "Ricketts RM (1960) / Case History Format",
    whatIsIt: 'Angle formed between the facial axis (Pterygoid point to Gnathion) and Basion-Nasion plane.',
    clinicalRelevance: 'Determines the direction of chin growth. <87° indicates vertical backward growth (dolichofacial); >93° indicates horizontal forward growth (brachyfacial).'
  },
  ricketts_facialDepth: {
    id: 'ricketts_facialDepth',
    name: 'Facial Depth (FH to N-Pog)',
    category: 'Ricketts Analysis',
    mean: 87.0,
    range: '84° to 90°',
    unit: 'degrees',
    source: "Ricketts RM (1960) / Case History Format",
    whatIsIt: 'Angle between Frankfort Horizontal and Facial Plane (N-Pog). Increases 1° every 3 years with growth.',
    clinicalRelevance: 'Indicates horizontal position of the mandible relative to cranial base.'
  },
  ricketts_convexityPointA: {
    id: 'ricketts_convexityPointA',
    name: 'Convexity of Point A',
    category: 'Ricketts Analysis',
    mean: 2.0,
    range: '0 to 4 mm',
    unit: 'mm',
    source: "Ricketts RM (1960) / Case History Format",
    whatIsIt: 'Distance from Point A to the Facial Plane (N-Pog). Decreases approx 1 mm per 3 years.',
    clinicalRelevance: '>4 mm indicates skeletal Class II; negative values indicate skeletal Class III.'
  },
  ricketts_lowerLipToEPlane: {
    id: 'ricketts_lowerLipToEPlane',
    name: 'Lower Lip to E-Plane (Ricketts Esthetic Plane)',
    category: 'Ricketts / Soft Tissue',
    mean: -2.0,
    range: '-4 to 0 mm',
    unit: 'mm',
    source: "Ricketts RM (1960) / Case History Format",
    whatIsIt: 'Distance from anterior border of lower lip to the line connecting tip of nose to soft-tissue pogonion.',
    clinicalRelevance: 'Positive value (lip in front of E-line) indicates lip protrusion; excessively negative (<-4 mm) indicates retrusive lip profile.'
  },

  // SOFT TISSUE
  soft_nasolabialAngle: {
    id: 'soft_nasolabialAngle',
    name: 'Nasolabial Angle',
    category: 'Soft Tissue Analysis',
    mean: 102.0,
    range: '90° to 110°',
    unit: 'degrees',
    source: "Burstone / Proffit 7th ed / Case History Format",
    whatIsIt: 'Angle formed between columella of nose and upper lip philtrum.',
    clinicalRelevance: '<90° indicates acute nasolabial angle / upper lip proclination or caudal septum inclination; >110° indicates obtuse angle / upper lip retrusion (caution with extractions).'
  },
  soft_merrifieldZAngle: {
    id: 'soft_merrifieldZAngle',
    name: 'Merrifield Z Angle',
    category: 'Soft Tissue Analysis',
    mean: 78.0,
    range: '75° to 80°',
    unit: 'degrees',
    source: "Merrifield LL (1966) / Case History Format",
    whatIsIt: 'Angle between Frankfort Horizontal and the profile line tangent to soft tissue chin and most prominent lip.',
    clinicalRelevance: 'Evaluates balance between lower face profile and skull base. <75° indicates protrusive lip profile.'
  },
  soft_sLineUpperLip: {
    id: 'soft_sLineUpperLip',
    name: "Steiner S-Line to Upper Lip",
    category: 'Soft Tissue Analysis',
    mean: 0.0,
    range: '-1 to +1 mm',
    unit: 'mm',
    source: "Steiner CC (1953) / Case History Format",
    whatIsIt: 'Distance from upper lip vermilion border to S-line (connecting midpoint of S-curved columella to soft pogonion).',
    clinicalRelevance: 'In a well-balanced profile, upper and lower lips lightly touch the S-line (0 mm).'
  },
  soft_sLineLowerLip: {
    id: 'soft_sLineLowerLip',
    name: "Steiner S-Line to Lower Lip",
    category: 'Soft Tissue Analysis',
    mean: 0.0,
    range: '-1 to +1 mm',
    unit: 'mm',
    source: "Steiner CC (1953) / Case History Format",
    whatIsIt: 'Distance from lower lip vermilion border to Steiner S-line.',
    clinicalRelevance: 'Values >0 mm indicate lip fullness/protrusion relative to nose-chin line.'
  }
};

export const BURSTONE_HARD_NORMS: Record<string, { male: number; female: number; unit: 'mm' | 'degrees'; description: string }> = {
  arPtm: { male: 37.1, female: 32.8, unit: 'mm', description: 'Posterior cranial base length' },
  ptmN: { male: 52.8, female: 50.9, unit: 'mm', description: 'Anterior cranial base length' },
  nAPgAngle: { male: 3.9, female: 2.6, unit: 'degrees', description: 'Facial convexity angle' },
  nA: { male: 0.0, female: -2.0, unit: 'mm', description: 'Maxillary position (N-A perp)' },
  nB: { male: -5.3, female: -6.9, unit: 'mm', description: 'Mandibular position (N-B perp)' },
  nPg: { male: -3.5, female: -6.5, unit: 'mm', description: 'Chin position (N-Pg perp)' },
  aB: { male: -4.8, female: -4.5, unit: 'mm', description: 'Apical base difference' },
  nAns: { male: 54.7, female: 50.0, unit: 'mm', description: 'Upper anterior facial height' },
  ansGn: { male: 68.6, female: 61.3, unit: 'mm', description: 'Lower anterior facial height' },
  pnsN: { male: 53.9, female: 50.6, unit: 'mm', description: 'Upper posterior facial height' },
  mpHp: { male: 24.2, female: 24.2, unit: 'degrees', description: 'Mandibular plane to horizontal plane' },
  u1Nf: { male: 30.5, female: 27.5, unit: 'mm', description: 'Maxillary central incisor height to nasal floor' },
  l1Mp: { male: 45.0, female: 40.8, unit: 'mm', description: 'Mandibular central incisor height to mandibular plane' },
  u6Nf: { male: 26.2, female: 23.0, unit: 'mm', description: 'Maxillary molar height to nasal floor' },
  l6Mp: { male: 35.8, female: 32.1, unit: 'mm', description: 'Mandibular molar height to mandibular plane' },
  pnsAns: { male: 57.7, female: 52.6, unit: 'mm', description: 'Maxillary length' },
  arGo: { male: 52.0, female: 46.8, unit: 'mm', description: 'Ramus height' },
  goPg: { male: 79.7, female: 74.3, unit: 'mm', description: 'Corpus length' },
  bPg: { male: 8.9, female: 7.2, unit: 'mm', description: 'Chin projection (B-Pg)' },
  arGoGn: { male: 119.0, female: 122.0, unit: 'degrees', description: 'Gonial angle' },
  opHp: { male: 6.2, female: 7.1, unit: 'degrees', description: 'Occlusal plane to horizontal plane' },
  u1NfAngle: { male: 111.0, female: 112.5, unit: 'degrees', description: 'Upper incisor to nasal floor angle' }
};

export const BURSTONE_SOFT_NORMS = {
  facialConvexityAngle: { mean: 12.0, range: '8° to 16°', unit: 'degrees', name: 'Facial Convexity Angle' },
  maxillaryPrognathism: { mean: 0.0, range: '-2 to +2 mm', unit: 'mm', name: 'Maxillary Soft Tissue Prognathism' },
  mandibularPrognathism: { mean: -3.0, range: '-5 to 0 mm', unit: 'mm', name: 'Mandibular Soft Tissue Prognathism' },
  verticalHeightRatio: { mean: 1.0, range: '0.9 to 1.1', unit: 'ratio', name: 'Vertical Height Ratio (G-Sn / Sn-Me\')' },
  lowerFaceThroatAngle: { mean: 100.0, range: '90° to 110°', unit: 'degrees', name: 'Lower Face-Throat Angle' },
  lowerVerticalHeightDepthRatio: { mean: 1.2, range: '1.0 to 1.4', unit: 'ratio', name: 'Lower Vertical Height / Throat Depth' },
  nasolabialAngle: { mean: 102.0, range: '90° to 110°', unit: 'degrees', name: 'Nasolabial Angle (Cm-Sn-Ls)' },
  upperLipProtrusion: { mean: 3.0, range: '1 to 5 mm', unit: 'mm', name: 'Upper Lip Protrusion (Ls to Sn-Pg\')' },
  lowerLipProtrusion: { mean: 2.0, range: '0 to 4 mm', unit: 'mm', name: 'Lower Lip Protrusion (Li to Sn-Pg\')' },
  mentolabialSulcus: { mean: 4.0, range: '2 to 6 mm', unit: 'mm', name: 'Mentolabial Sulcus Depth' },
  verticalLipChinRatio: { mean: 0.5, range: '0.45 to 0.55', unit: 'ratio', name: 'Vertical Lip-Chin Ratio (Sn-Stms / Stmi-Me\')' },
  maxillaryIncisorExposure: { mean: 2.5, range: '1 to 4 mm', unit: 'mm', name: 'Maxillary Incisor Exposure at Rest' },
  interlabialGap: { mean: 2.0, range: '0 to 3 mm', unit: 'mm', name: 'Interlabial Gap at Rest' }
};

export const TEXTBOOK_CITATIONS = [
  {
    title: 'Contemporary Orthodontics (7th Edition)',
    authors: 'Henry Fields, Brent Larson, David M. Sarver, William R. Proffit',
    year: '2025',
    publisher: 'Elsevier',
    annotation: 'Primary comprehensive reference for problem-oriented orthodontic diagnosis, biomechanics, facial aesthetics, and treatment planning hierarchy.'
  },
  {
    title: 'Orthodontics: Current Principles and Techniques (7th Edition)',
    authors: 'Lee W. Graber, Katherine W. L. Vig, Greg J. Huang, Pádhraig S. Fleming',
    year: '2022',
    publisher: 'Elsevier',
    annotation: 'Standard orthodontic reference for biological principles, modern clinical cephalometrics, 3D imaging, and evidence-based orthodontic therapy.'
  },
  {
    title: 'The Cervical Vertebral Maturation (CVM) Method for Assessment of Optimal Treatment Timing in Dentofacial Orthopedics',
    authors: 'T. Baccetti, L. Franchi, J. A. McNamara Jr.',
    year: '2005',
    publisher: 'Seminars in Orthodontics 11(3):119-129',
    annotation: 'Staging of cervical vertebrae CS1 through CS6 for identifying the mandibular adolescent growth peak.'
  },
  {
    title: 'Disharmonies of Tooth Size and its Relation to the Analysis and Treatment of Malocclusion (Bolton Analysis)',
    authors: 'Wayne A. Bolton',
    year: '1958',
    publisher: 'Angle Orthodontist 28:113-130',
    annotation: 'Standard for overall 12-tooth (91.3%) and anterior 6-tooth (77.2%) interarch tooth size discrepancy evaluation.'
  },
  {
    title: 'A Key to Normal Occlusion',
    authors: 'Lawrence F. Andrews',
    year: '1972',
    publisher: 'American Journal of Orthodontics 62(3):296-309',
    annotation: 'Six keys to normal occlusion, molar relationship, crown angulation, crown inclination, rotation absence, tight spaces, and flat curve of Spee.'
  },
  {
    title: 'The "Wits" Appraisal of Jaw Disharmony',
    authors: 'Alexander Jacobson',
    year: '1975',
    publisher: 'American Journal of Orthodontics 67(2):125-138',
    annotation: 'Assessment of sagittal jaw discrepancy relative to functional occlusal plane.'
  },
  {
    title: 'The Frankfort-Mandibular Incisor Angle (FMIA) in Orthodontic Diagnosis, Treatment Planning and Prognosis',
    authors: 'Charles H. Tweed',
    year: '1954',
    publisher: 'The Angle Orthodontist 24(3):121-169',
    annotation: 'Tweed diagnostic triangle: FMPA (25°), FMIA (65°), IMPA (90°).'
  },
  {
    title: 'Cephalometrics in Clinical Practice (Steiner Analysis)',
    authors: 'Cecil C. Steiner',
    year: '1953',
    publisher: 'The Angle Orthodontist 23(1):8-29',
    annotation: 'Standard skeletal (SNA, SNB, ANB) and dental incisor-to-plane relationships.'
  },
  {
    title: 'Variations in Facial Relationships: Their Significance in Analysis and Treatment (Downs Analysis)',
    authors: 'William B. Downs',
    year: '1948',
    publisher: 'American Journal of Orthodontics 34(10):812-840',
    annotation: 'First comprehensive cephalometric analysis separating skeletal and dental patterns.'
  },
  {
    title: 'A Method of Cephalometric Evaluation (McNamara Analysis)',
    authors: 'James A. McNamara Jr.',
    year: '1984',
    publisher: 'American Journal of Orthodontics 86(6):449-469',
    annotation: 'Airway, skeletal components relative to Nasion Perpendicular, and effective lengths.'
  }
];
