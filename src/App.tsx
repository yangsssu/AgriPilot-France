import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Cell, ReferenceLine
} from 'recharts';
import { Leaf, Tractor, Euro, CloudRain, Sun, Sprout, MapPin, TrendingUp, AlertTriangle, Wind, RefreshCw, Smartphone, BadgeCheck, LayoutGrid, List, Skull, Info, Droplets, Globe, Languages, ChevronDown, Thermometer, Bug, Activity } from 'lucide-react';

// --- 1. Simulation Database (Bilingual) ---

const REGIONS = [
  { 
    id: 'hdf', 
    name: 'Hauts-de-France', 
    name_fr: 'Hauts-de-France',
    soilQuality: 1.35, 
    desc: 'World-class region for sugar beets & potatoes. Extremely fertile soil.',
    desc_fr: 'Région de classe mondiale pour la betterave sucrière et la pomme de terre. Sol extrêmement fertile.',
    color: '#f87171' 
  },
  { 
    id: 'normandie', 
    name: 'Normandie', 
    name_fr: 'Normandie',
    soilQuality: 1.15, 
    desc: 'Mixed farming: Flax, wheat, dairy, and pastures.', 
    desc_fr: 'Polyculture : lin, blé, produits laitiers et pâturages.',
    color: '#4ade80' 
  },
  { 
    id: 'idf', 
    name: 'Île-de-France', 
    name_fr: 'Île-de-France',
    soilQuality: 1.25, 
    desc: 'The Beauce plain ("Granary of France"). Intensive cereal production.', 
    desc_fr: 'Plaine de la Beauce ("Grenier de la France"). Production céréalière intensive.',
    color: '#fbbf24' 
  },
  { 
    id: 'grandest', 
    name: 'Grand Est', 
    name_fr: 'Grand Est',
    soilQuality: 1.15, 
    desc: 'Barley, rapeseed, and vineyards (Champagne).', 
    desc_fr: 'Orge, colza et vignobles (Champagne).',
    color: '#f472b6' 
  },
  { 
    id: 'bretagne', 
    name: 'Bretagne', 
    name_fr: 'Bretagne',
    soilQuality: 0.95, 
    desc: 'Intensive livestock, silage corn, and vegetables.', 
    desc_fr: 'Élevage intensif, maïs ensilage et légumes.',
    color: '#60a5fa' 
  },
  { 
    id: 'pdl', 
    name: 'Pays de la Loire', 
    name_fr: 'Pays de la Loire',
    soilQuality: 1.05, 
    desc: 'Diverse agriculture: Polyculture and livestock.', 
    desc_fr: 'Agriculture diversifiée : Polyculture et élevage.',
    color: '#c084fc' 
  },
  { 
    id: 'cvl', 
    name: 'Centre-Val de Loire', 
    name_fr: 'Centre-Val de Loire',
    soilQuality: 1.2, 
    desc: 'Vast plains of cereals and oilseeds.', 
    desc_fr: 'Vastes plaines de céréales et d\'oléagineux.',
    color: '#facc15' 
  },
  { 
    id: 'bfc', 
    name: 'Bourgogne-Franche-Comté', 
    name_fr: 'Bourgogne-Franche-Comté',
    soilQuality: 1.05, 
    desc: 'Wheat plains meeting Charolais cattle hills.', 
    desc_fr: 'Plaines à blé rencontrant les collines à bétail Charolais.',
    color: '#94a3b8' 
  },
  { 
    id: 'na', 
    name: 'Nouvelle-Aquitaine', 
    name_fr: 'Nouvelle-Aquitaine',
    soilQuality: 1.1, 
    desc: 'Largest agricultural region: Corn, sunflowers, wine.', 
    desc_fr: 'Plus grande région agricole : Maïs, tournesol, vin.',
    color: '#a3e635' 
  },
  { 
    id: 'ara', 
    name: 'Auvergne-Rhône-Alpes', 
    name_fr: 'Auvergne-Rhône-Alpes',
    soilQuality: 0.95, 
    desc: 'Diverse topography: Valley corn, mountain pasture.', 
    desc_fr: 'Topographie variée : Maïs en vallée, pâturages de montagne.',
    color: '#67e8f9' 
  },
  { 
    id: 'occitanie', 
    name: 'Occitanie', 
    name_fr: 'Occitanie',
    soilQuality: 0.9, 
    desc: 'Hot, dry climate. Durum wheat and sunflowers.', 
    desc_fr: 'Climat chaud et sec. Blé dur et tournesol.',
    color: '#fb923c' 
  },
  { 
    id: 'paca', 
    name: 'Provence-Alpes-Côte d\'Azur', 
    name_fr: 'PACA',
    soilQuality: 0.85, 
    desc: 'Fruits, lavender, durum wheat. High irrigation dependency.', 
    desc_fr: 'Fruits, lavande, blé dur. Forte dépendance à l\'irrigation.',
    color: '#d8b4fe' 
  },
];

const CROPS = {
  winterWheat: { 
    name: 'Winter Wheat', name_fr: 'Blé Tendre', type: 'Cereal', baseYield: 7.8, basePrice: 210, icon: '🌾', 
    droughtTol: 0.85, wetTol: 0.7, 
    waterNeeds: 'Low', waterNeeds_fr: 'Faible',
    wetRisk: 'Fusarium/Septoria', wetRisk_fr: 'Fusariose/Septoriose',
    droughtRisk: 'Grain shriveling', droughtRisk_fr: 'Échaudage',
    // New Specs
    diseaseSens: 'High (Fungal)', diseaseSens_fr: 'Élevée (Fongique)',
    tempRes: 'High (Frost tolerant)', tempRes_fr: 'Élevée (Tolérant au gel)',
    droughtRes: 'Medium', droughtRes_fr: 'Moyenne'
  },
  barley: { 
    name: 'Barley', name_fr: 'Orge', type: 'Cereal', baseYield: 7.2, basePrice: 195, icon: '🍺', 
    droughtTol: 0.88, wetTol: 0.8, 
    waterNeeds: 'Low', waterNeeds_fr: 'Faible',
    wetRisk: 'Rhynchosporium', wetRisk_fr: 'Rhynchosporiose',
    droughtRisk: 'Yield reduction', droughtRisk_fr: 'Baisse rendement',
    // New Specs
    diseaseSens: 'Medium', diseaseSens_fr: 'Moyenne',
    tempRes: 'Medium', tempRes_fr: 'Moyenne',
    droughtRes: 'High (Early harvest)', droughtRes_fr: 'Élevée (Récolte précoce)'
  },
  corn: { 
    name: 'Corn (Maize)', name_fr: 'Maïs', type: 'Cereal', baseYield: 10.0, basePrice: 205, icon: '🌽', 
    droughtTol: 0.5, wetTol: 0.95, 
    waterNeeds: 'High', waterNeeds_fr: 'Élevé',
    wetRisk: 'Harvest difficulties', wetRisk_fr: 'Difficultés récolte',
    droughtRisk: 'Flowering abortion', droughtRisk_fr: 'Avortement floraison',
    // New Specs
    diseaseSens: 'Low', diseaseSens_fr: 'Faible',
    tempRes: 'High (Loves heat)', tempRes_fr: 'Élevée (Aime la chaleur)',
    droughtRes: 'Very Low', droughtRes_fr: 'Très Faible'
  },
  sunflower: { 
    name: 'Sunflower', name_fr: 'Tournesol', type: 'Oilseed', baseYield: 2.8, basePrice: 440, icon: '🌻', 
    droughtTol: 0.92, wetTol: 0.55, 
    waterNeeds: 'Low', waterNeeds_fr: 'Faible',
    wetRisk: 'Sclerotinia (White mold)', wetRisk_fr: 'Sclérotiniose',
    droughtRisk: 'Oil content drop', droughtRisk_fr: 'Baisse teneur huile',
    // New Specs
    diseaseSens: 'High (Wet conditions)', diseaseSens_fr: 'Élevée (Humidité)',
    tempRes: 'High', tempRes_fr: 'Élevée',
    droughtRes: 'Very High (Deep roots)', droughtRes_fr: 'Très Élevée (Racines prof.)'
  },
  rapeseed: { 
    name: 'Rapeseed', name_fr: 'Colza', type: 'Oilseed', baseYield: 3.5, basePrice: 460, icon: '🌼', 
    droughtTol: 0.75, wetTol: 0.8, 
    waterNeeds: 'Medium', waterNeeds_fr: 'Moyen',
    wetRisk: 'Sclerotinia', wetRisk_fr: 'Sclérotiniose',
    droughtRisk: 'Poor establishment', droughtRisk_fr: 'Mauvaise levée',
    // New Specs
    diseaseSens: 'High (Insects/Fungi)', diseaseSens_fr: 'Élevée (Insectes/Champ.)',
    tempRes: 'Medium', tempRes_fr: 'Moyenne',
    droughtRes: 'Medium', droughtRes_fr: 'Moyenne'
  },
  sugarBeet: { 
    name: 'Sugar Beet', name_fr: 'Betterave Sucrière', type: 'Root', baseYield: 82.0, basePrice: 42, icon: '🍬', 
    droughtTol: 0.7, wetTol: 0.9, 
    waterNeeds: 'Medium', waterNeeds_fr: 'Moyen',
    wetRisk: 'Cercospora/Root rot', wetRisk_fr: 'Cercosporiose/Pourriture',
    droughtRisk: 'Severe wilting', droughtRisk_fr: 'Flétrissement sévère',
    // New Specs
    diseaseSens: 'High (Virus yellows)', diseaseSens_fr: 'Élevée (Jaunisse)',
    tempRes: 'Medium', tempRes_fr: 'Moyenne',
    droughtRes: 'Medium', droughtRes_fr: 'Moyenne'
  }, 
  potato: { 
    name: 'Potatoes', name_fr: 'Pommes de terre', type: 'Tuber', baseYield: 45.0, basePrice: 180, icon: '🥔', 
    droughtTol: 0.6, wetTol: 0.5, 
    waterNeeds: 'Very High', waterNeeds_fr: 'Très Élevé',
    wetRisk: 'LATE BLIGHT (Mildiou)', wetRisk_fr: 'MILDIOU',
    droughtRisk: 'Tuber malformation', droughtRisk_fr: 'Malformation tubercules',
    // New Specs
    diseaseSens: 'Critical (Late Blight)', diseaseSens_fr: 'Critique (Mildiou)',
    tempRes: 'Low (Heat stress)', tempRes_fr: 'Faible (Stress thermique)',
    droughtRes: 'Low', droughtRes_fr: 'Faible'
  },
};

const PRACTICES = {
  conventional: { 
    name: 'Conventional', name_fr: 'Conventionnel', short: 'Conventional', short_fr: 'Conv.',
    desc: 'Standard intensive farming. High inputs, reliable high yields.',
    desc_fr: 'Agriculture intensive standard. Intrants élevés, rendements fiables.',
    yieldMod: 1.0, costMod: 1.0, priceMod: 1.0, subsidyBase: 160, ecoScore: 35, icon: Tractor
  },
  precision: { 
    name: 'Precision Farming', name_fr: 'Agri. de Précision', short: 'Precision', short_fr: 'Précision',
    desc: 'GPS & sensors to optimize inputs. Reduces cost & waste.',
    desc_fr: 'GPS & capteurs pour optimiser les intrants. Réduit coûts & gaspillage.',
    yieldMod: 1.05, costMod: 0.92, priceMod: 1.0, subsidyBase: 180, ecoScore: 60, icon: Smartphone
  },
  hve: { 
    name: 'HVE Certification', name_fr: 'Certification HVE', short: 'HVE (Lvl 3)', short_fr: 'HVE (Niv 3)',
    desc: 'High Environmental Value. Certified sustainable practices.',
    desc_fr: 'Haute Valeur Environnementale. Pratiques durables certifiées.',
    yieldMod: 0.95, costMod: 1.02, priceMod: 1.08, subsidyBase: 220, ecoScore: 70, icon: BadgeCheck
  },
  conservation: { 
    name: 'Conservation (ACS)', name_fr: 'Conservation (ACS)', short: 'Conservation', short_fr: 'ACS',
    desc: 'No-till, cover crops. Improves soil water retention.',
    desc_fr: 'Semis direct, couverts végétaux. Améliore la rétention d\'eau.',
    yieldMod: 0.92, costMod: 0.75, priceMod: 1.05, subsidyBase: 260, ecoScore: 85, icon: Wind
  },
  organic: { 
    name: 'Organic (AB)', name_fr: 'Biologique (AB)', short: 'Organic (AB)', short_fr: 'Bio (AB)',
    desc: 'No synthetics. High market premium, high risk in wet years.',
    desc_fr: 'Sans synthèse. Prime de marché élevée, haut risque si humide.',
    yieldMod: 0.6, costMod: 0.85, priceMod: 2.1, subsidyBase: 340, ecoScore: 95, icon: Leaf
  },
};

const CLIMATES = {
  normal: { 
    name: 'Normal Year', name_fr: 'Année Normale', icon: Sun, 
    desc: 'Average historical weather patterns.',
    desc_fr: 'Conditions météorologiques historiques moyennes.'
  },
  drought: { 
    name: 'Drought / Heatwave', name_fr: 'Sécheresse / Canicule', icon: AlertTriangle, 
    desc: 'Water restrictions, high evapotranspiration.',
    desc_fr: 'Restrictions d\'eau, forte évapotranspiration.'
  },
  wet: { 
    name: 'Excess Rain / Flood', name_fr: 'Pluie / Inondation', icon: CloudRain, 
    desc: 'High disease pressure, difficult harvest.',
    desc_fr: 'Forte pression des maladies, récolte difficile.'
  },
};

// --- 2. Calculation Logic Helper (Centralized) ---

const calculateScenario = (region: any, cropKey: string, practiceKey: string, climateKey: string, lang: 'en' | 'fr') => {
    const crop = CROPS[cropKey as keyof typeof CROPS];
    const practice = PRACTICES[practiceKey as keyof typeof PRACTICES];
    
    // 1. Yield Calculation
    let yieldFactor = 1.0;
    let riskMessage = null;

    if (climateKey === 'drought') {
        yieldFactor = crop.droughtTol;
        // Conservation bonus
        if (practiceKey === 'conservation') yieldFactor += 0.12;
        // Precision bonus (optimized irrigation)
        if (practiceKey === 'precision') yieldFactor += 0.05;
        
        // Specific warnings
        if (crop.waterNeeds === 'High' || crop.waterNeeds === 'Very High') {
            riskMessage = lang === 'en' 
                ? `DROUGHT WARNING: ${crop.droughtRisk}`
                : `ALERTE SÉCHERESSE : ${crop.droughtRisk_fr}`;
        }
    } else if (climateKey === 'wet') {
        yieldFactor = crop.wetTol;
        
        // Organic penalty in wet years (no fungicides)
        if (practiceKey === 'organic') {
            yieldFactor -= 0.2; // General organic penalty for wetness
            if (cropKey === 'potato') yieldFactor *= 0.4; // Disaster for organic potato
            if (cropKey === 'sunflower') yieldFactor *= 0.6; // Rot for organic sunflower
        }
        
        riskMessage = lang === 'en'
            ? `DISEASE WARNING: ${crop.wetRisk}`
            : `ALERTE MALADIE : ${crop.wetRisk_fr}`;
    }

    const yieldPerHa = crop.baseYield * region.soilQuality * practice.yieldMod * yieldFactor;

    // 2. Financials
    const farmGatePrice = crop.basePrice * practice.priceMod;
    const grossIncome = yieldPerHa * farmGatePrice;
    const subsidies = practice.subsidyBase;

    // 3. Costs Calculation
    let baseOpCost = 450; 
    if (cropKey === 'sugarBeet') baseOpCost = 1400;
    if (cropKey === 'potato') baseOpCost = 3000;
    if (cropKey === 'corn') baseOpCost = 700;

    let baseMachCost = 350;

    let specializedCost = 0;
    if (cropKey === 'potato') specializedCost += 1800; 
    if (cropKey === 'sugarBeet') specializedCost += 600; 
    if (cropKey === 'corn') specializedCost += 150; 

    // -- IRRIGATION COST LOGIC --
    let irrigationCost = 0;
    const waterPriceFactor = climateKey === 'drought' ? 2.5 : 1.0; 

    if (crop.waterNeeds === 'Very High') irrigationCost = 400 * waterPriceFactor;
    else if (crop.waterNeeds === 'High') irrigationCost = 250 * waterPriceFactor;
    else if (crop.waterNeeds === 'Medium') irrigationCost = 100 * waterPriceFactor;
    
    let fungicideExtra = 0;
    if (climateKey === 'wet' && practiceKey !== 'organic') {
        fungicideExtra = 150; 
    }

    // -- NITROGEN LEAKING FINE (ENVIRONMENTAL REGULATION) --
    // Implemented as a "Compliance Risk Cost" logic for France's Nitrate Directive
    // "Zone Vulnérable" logic: If Wet + Conventional -> High risk of leaching -> PAC Subsidy reduction or remediation cost
    let envFine = 0;
    if (climateKey === 'wet' && (practiceKey === 'conventional' || practiceKey === 'precision')) {
        // Penalty for nitrogen leaching risk in wet conditions
        envFine = 250; 
        if (!riskMessage) {
            riskMessage = lang === 'en' 
                ? "ENV WARNING: Nitrogen leaching risk detected. Potential CAP penalties."
                : "ALERTE ENV: Risque de lessivage d'azote. Pénalités PAC potentielles.";
        }
    }

    // Apply Practice Modifiers
    let finalOpCost = (baseOpCost + fungicideExtra) * practice.costMod;
    let finalMechCost = baseMachCost * practice.costMod;
    
    if (practiceKey === 'conservation') finalMechCost *= 0.7; 
    
    if (practiceKey === 'organic' && (cropKey === 'potato' || cropKey === 'sugarBeet')) {
        finalOpCost *= 1.2; 
    }

    const totalCost = finalOpCost + finalMechCost + specializedCost + irrigationCost + envFine;
    const netMargin = grossIncome + subsidies - totalCost;

    return {
        yield: yieldPerHa,
        grossIncome,
        subsidies,
        totalCost,
        netMargin,
        ecoScore: practice.ecoScore,
        farmGatePrice,
        riskMessage,
        envFine, // Exposed for chart if needed, currently bundled in Total Costs
        isLoss: netMargin < 0
    };
};

// --- 3. UI Components ---

const RegionGrid = ({ selectedRegion, onSelect, lang }: any) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full overflow-y-auto pr-2 custom-scrollbar">
      {REGIONS.map((region) => {
        const isSelected = selectedRegion?.id === region.id;
        return (
          <button
            key={region.id}
            onClick={() => onSelect(region)}
            className={`text-left p-4 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden ${
              isSelected 
                ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-sm'
            }`}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isSelected ? 'bg-indigo-500' : 'bg-transparent group-hover:bg-indigo-300'}`}></div>
            <div className="flex justify-between items-start mb-1">
                <span className={`font-bold text-sm ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {lang === 'en' ? region.name : region.name_fr}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${isSelected ? 'bg-white text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                    {lang === 'en' ? 'Soil' : 'Sol'}: {region.soilQuality}x
                </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
                {lang === 'en' ? region.desc : region.desc_fr}
            </p>
          </button>
        )
      })}
    </div>
  );
};

// --- 4. Main Application ---

export default function AgriPilotFrance() {
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [selectedCrop, setSelectedCrop] = useState('winterWheat');
  const [selectedPractice, setSelectedPractice] = useState('conventional');
  const [selectedClimate, setSelectedClimate] = useState('normal');

  const handleRegionSelect = (region: any) => {
    setSelectedRegion(region);
    setHasStarted(true);
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'fr' : 'en');
  }

  // --- Main Simulation Data ---
  const simulation = useMemo(() => {
    if (!selectedRegion) return null;
    return calculateScenario(selectedRegion, selectedCrop, selectedPractice, selectedClimate, lang);
  }, [selectedRegion, selectedCrop, selectedPractice, selectedClimate, lang]);

  // --- Comparison Data ---
  
  const comparePracticesData = useMemo(() => {
    if (!selectedRegion) return [];
    return Object.keys(PRACTICES).map((key) => {
        const sim = calculateScenario(selectedRegion, selectedCrop, key, selectedClimate, lang);
        return {
            name: lang === 'en' ? PRACTICES[key as keyof typeof PRACTICES].short : PRACTICES[key as keyof typeof PRACTICES].short_fr,
            profit: Math.round(sim.netMargin),
            yield: sim.yield
        };
    });
  }, [selectedRegion, selectedCrop, selectedClimate, lang]);

  const compareCropsData = useMemo(() => {
    if (!selectedRegion) return [];
    return Object.keys(CROPS).map((key) => {
        const sim = calculateScenario(selectedRegion, key, selectedPractice, selectedClimate, lang);
        return {
            name: lang === 'en' ? CROPS[key as keyof typeof CROPS].name.split(' ')[0] : CROPS[key as keyof typeof CROPS].name_fr.split(' ')[0],
            profit: Math.round(sim.netMargin),
            yield: sim.yield
        };
    });
  }, [selectedRegion, selectedPractice, selectedClimate, lang]);

  const compareRegionsData = useMemo(() => {
    return REGIONS.map((r) => {
        const sim = calculateScenario(r, selectedCrop, selectedPractice, selectedClimate, lang);
        return {
            name: lang === 'en' ? r.name : r.name_fr,
            profit: Math.round(sim.netMargin)
        };
    }).sort((a, b) => b.profit - a.profit);
  }, [selectedCrop, selectedPractice, selectedClimate, lang]);

  // UI Texts
  const t = {
      title: 'AgriPilot France',
      reset: lang === 'en' ? 'Reset Map' : 'Réinitialiser',
      selectRegion: lang === 'en' ? 'Select Region' : 'Choisir une région',
      clickBelow: lang === 'en' ? 'Click list below 👇' : 'Cliquez sur la liste 👇',
      heroTitle: lang === 'en' ? 'AgriPilot France' : 'AgriPilot France',
      heroSub: lang === 'en' ? 'Digital Twin of Agriculture' : 'Jumeau Numérique de l\'Agriculture',
      heroDesc: lang === 'en' ? 'Select a region to begin. Data calibrated with 2024 French Agreste data' : 'Sélectionnez une région pour commencer. Données calibrées avec les modèles Agreste & Cerfrance 2024.',
      step1: lang === 'en' ? '1. Select Crop' : '1. Choisir la Culture',
      step2: lang === 'en' ? '2. Farming Practice' : '2. Pratique Agricole',
      step3: lang === 'en' ? '3. Climate Scenario' : '3. Scénario Climatique',
      waterNeeds: lang === 'en' ? 'Water Needs' : 'Besoins en eau',
      diseaseSens: lang === 'en' ? 'Disease Sensitivity' : 'Sensibilité Maladies',
      tempRes: lang === 'en' ? 'Temp Resilience' : 'Résilience Temp.',
      droughtRes: lang === 'en' ? 'Drought Resilience' : 'Résilience Sécheresse',
      estYield: lang === 'en' ? 'Estimated Yield' : 'Rendement Estimé',
      droughtImpact: lang === 'en' ? 'Drought Impact' : 'Impact Sécheresse',
      normalProj: lang === 'en' ? 'Normal projection' : 'Projection normale',
      netMargin: lang === 'en' ? 'Net Margin' : 'Marge Nette',
      costDeducted: lang === 'en' ? 'Costs deducted' : 'Coûts déduits',
      ecoScore: lang === 'en' ? 'Eco Score' : 'Eco-Score',
      ecoExcellent: lang === 'en' ? 'Excellent Biodiversity' : 'Excellente Biodiversité',
      ecoSust: lang === 'en' ? 'Sustainable' : 'Durable',
      ecoNeedsImp: lang === 'en' ? 'Needs Improvement' : 'À Améliorer',
      econBreakdown: lang === 'en' ? 'Economic Breakdown (€/ha)' : 'Analyse Économique (€/ha)',
      highCostWarn: lang === 'en' ? 'High costs due to specialized equipment, irrigation, seeds, or storage for this crop.' : 'Coûts élevés dus aux équipements spécialisés, à l\'irrigation, aux semences ou au stockage.',
      sales: lang === 'en' ? 'Sales (Farm Gate)' : 'Ventes (Départ Ferme)',
      subsidies: lang === 'en' ? 'Subsidies (PAC)' : 'Subventions (PAC)',
      totalCosts: lang === 'en' ? 'Total Costs (Inputs, Mach., Irrig.)' : 'Coûts Totaux (Intrants, Mach., Irrig.)',
      netProfit: lang === 'en' ? 'Net Profit' : 'Profit Net',
      amount: lang === 'en' ? 'Amount' : 'Montant',
      cropComp: lang === 'en' ? 'Crop Profit Comparison' : 'Comparaison des Profits (Cultures)',
      pracComp: lang === 'en' ? 'Practice Profit Comparison' : 'Comparaison des Profits (Pratiques)',
      regComp: lang === 'en' ? 'Regional Profitability Comparison' : 'Comparaison de Rentabilité Régionale',
      regCompSub: lang === 'en' ? 'Comparing net margin for' : 'Comparaison de la marge nette pour',
      across: lang === 'en' ? 'across all regions.' : 'dans toutes les régions.',
      scenario: lang === 'en' ? 'Scenario' : 'Scénario',
      practice: lang === 'en' ? 'Practice' : 'Pratique',
      crop: lang === 'en' ? 'Crop' : 'Culture',
      envPenalty: lang === 'en' ? 'Nitrate Leaching Fine' : 'Pénalité Nitrates',
  };

  const currentCrop = CROPS[selectedCrop as keyof typeof CROPS];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden flex flex-col">
      
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-200 px-4 md:px-6 py-3 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
           {t.title}
        </h1>
        
        <div className="flex items-center gap-2 md:gap-4">
            {/* Language Toggle */}
            <button 
                onClick={toggleLang}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors border border-slate-200"
            >
                <Languages size={14} />
                {lang === 'en' ? 'EN' : 'FR'}
            </button>

            {hasStarted ? (
                 <>
                    <button 
                        onClick={() => { setHasStarted(false); setSelectedRegion(null); }}
                        className="text-xs font-semibold flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors hidden sm:flex"
                    >
                        <RefreshCw size={14} /> {t.reset}
                    </button>
                    {/* Region Selector in Header - FIXED DROPDOWN */}
                    <div className="relative group pb-2 -mb-2">
                         <div className="text-sm font-medium text-indigo-700 bg-indigo-50 pl-3 pr-8 py-1.5 rounded-full flex items-center gap-2 border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-colors">
                            <MapPin size={16} className="text-indigo-500"/> 
                            {lang === 'en' ? selectedRegion.name : selectedRegion.name_fr}
                            <ChevronDown size={14} className="absolute right-3 text-indigo-400"/>
                        </div>
                        {/* Dropdown Menu - Added pt-2 to bridge the gap */}
                        <div className="absolute top-full right-0 pt-2 w-56 hidden group-hover:block z-50">
                            <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-1 max-h-80 overflow-y-auto">
                                {REGIONS.map(r => (
                                    <button
                                        key={r.id}
                                        onClick={() => handleRegionSelect(r)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${selectedRegion.id === r.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {lang === 'en' ? r.name : r.name_fr}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                 </>
            ) : null}
        </div>
      </header>

      <main className="pt-24 px-4 md:px-8 pb-12 flex-grow">
        <div className="flex flex-col xl:flex-row h-full gap-8">
            
          {/* === Left Column: Region List === */}
          <div className={`transition-all duration-700 ease-in-out ${hasStarted ? 'xl:w-4/12 h-auto' : 'w-full flex flex-col items-center justify-center min-h-[80vh]'}`}>
            
            {!hasStarted && (
                <div className="text-center mb-10 animate-fade-in-up px-4 max-w-2xl">
                    <h2 className="text-5xl font-extrabold text-slate-800 mb-6 leading-tight">{t.heroTitle}<br/><span className="text-indigo-600">{t.heroSub}</span></h2>
                    <p className="text-slate-500 text-xl">{t.heroDesc}</p>
                </div>
            )}

            <div className={`bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-700 w-full flex flex-col ${hasStarted ? 'h-[85vh]' : 'h-[600px] max-w-4xl'}`}>
               <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <LayoutGrid size={14} /> {t.selectRegion}
                  </span>
                  {!hasStarted && <span className="text-xs text-indigo-500 animate-pulse">{t.clickBelow}</span>}
               </div>
               <div className="flex-1 overflow-hidden p-3">
                 <RegionGrid 
                   selectedRegion={selectedRegion} 
                   onSelect={handleRegionSelect} 
                   lang={lang}
                 />
               </div>
            </div>
          </div>

          {/* === Right Column: Control & Analytics === */}
          {hasStarted && simulation && (
            <div className="xl:w-8/12 animate-slide-in-right space-y-6 pb-6">
              
              {/* 1. Control Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Crop Selector */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <Sprout size={14}/> {t.step1}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(CROPS).map(([key, val]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedCrop(key)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-all ${
                                    selectedCrop === key 
                                    ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-sm' 
                                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-white hover:border-slate-300'
                                }`}
                            >
                                <span className="text-lg">{val.icon}</span> 
                                <span>{lang === 'en' ? val.name.split('(')[0] : val.name_fr.split('(')[0]}</span>
                            </button>
                        ))}
                    </div>
                    {/* Detailed Crop Specs */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="text-xs bg-slate-50 p-2 rounded border border-slate-100 flex gap-2">
                             <Droplets size={14} className="text-blue-500 shrink-0"/>
                             <div>
                                 <span className="block font-bold text-slate-700">{t.waterNeeds}</span>
                                 <span className="text-slate-500">{lang === 'en' ? currentCrop.waterNeeds : currentCrop.waterNeeds_fr}</span>
                             </div>
                        </div>
                        <div className="text-xs bg-slate-50 p-2 rounded border border-slate-100 flex gap-2">
                             <Bug size={14} className="text-rose-500 shrink-0"/>
                             <div>
                                 <span className="block font-bold text-slate-700">{t.diseaseSens}</span>
                                 <span className="text-slate-500">{lang === 'en' ? currentCrop.diseaseSens : currentCrop.diseaseSens_fr}</span>
                             </div>
                        </div>
                        <div className="text-xs bg-slate-50 p-2 rounded border border-slate-100 flex gap-2">
                             <Thermometer size={14} className="text-orange-500 shrink-0"/>
                             <div>
                                 <span className="block font-bold text-slate-700">{t.tempRes}</span>
                                 <span className="text-slate-500">{lang === 'en' ? currentCrop.tempRes : currentCrop.tempRes_fr}</span>
                             </div>
                        </div>
                        <div className="text-xs bg-slate-50 p-2 rounded border border-slate-100 flex gap-2">
                             <Activity size={14} className="text-emerald-500 shrink-0"/>
                             <div>
                                 <span className="block font-bold text-slate-700">{t.droughtRes}</span>
                                 <span className="text-slate-500">{lang === 'en' ? currentCrop.droughtRes : currentCrop.droughtRes_fr}</span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Climate Selector */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                     <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <CloudRain size={14}/> {t.step3}
                     </h3>
                     <div className="flex gap-2">
                        {Object.entries(CLIMATES).map(([key, val]) => (
                            <button 
                                key={key}
                                onClick={() => setSelectedClimate(key)}
                                className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 ${
                                    selectedClimate === key
                                    ? 'bg-slate-800 text-white shadow-lg scale-105'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                            >
                                <val.icon size={18} />
                                <span className="text-center">{lang === 'en' ? val.name.split('/')[0] : val.name_fr.split('/')[0]}</span>
                            </button>
                        ))}
                     </div>
                </div>

                {/* Practice Selector (Full Width) */}
                <div className="md:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                     <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <Tractor size={14}/> {t.step2}
                     </h3>
                     <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {Object.entries(PRACTICES).map(([key, val]) => {
                            const Icon = val.icon;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setSelectedPractice(key)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                                        selectedPractice === key
                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                                        : 'border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100'
                                    }`}
                                >
                                    <Icon size={20} className="mb-1" />
                                    <span className="font-bold text-xs text-center leading-tight">{lang === 'en' ? val.short : val.short_fr}</span>
                                </button>
                            )
                        })}
                     </div>
                     <p className="text-xs text-center text-slate-500 mt-3 bg-slate-50 py-2 rounded-lg border border-slate-100 px-4">
                        ℹ️ {lang === 'en' ? PRACTICES[selectedPractice as keyof typeof PRACTICES].desc : PRACTICES[selectedPractice as keyof typeof PRACTICES].desc_fr}
                     </p>
                </div>

              </div>

              {/* 2. KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Yield Card */}
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all">
                      <p className="text-slate-400 text-xs font-bold uppercase">{t.estYield}</p>
                      <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-slate-800">{simulation.yield.toFixed(1)}</span>
                          <span className="text-sm text-slate-500 font-medium">t/ha</span>
                      </div>
                      <div className="mt-2 text-xs flex items-center gap-1 text-slate-400">
                        {selectedClimate === 'drought' ? <span className="text-red-500 font-bold flex items-center gap-1"><TrendingUp className="rotate-180" size={12}/> {t.droughtImpact}</span> : t.normalProj}
                      </div>
                  </div>

                  {/* Profit Card (With Risk Warning) */}
                  <div className={`p-5 rounded-2xl shadow-sm border flex flex-col justify-between hover:shadow-md transition-all ${simulation.isLoss ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100'}`}>
                      <div className="flex justify-between items-start">
                         <p className={`${simulation.isLoss ? 'text-red-400' : 'text-slate-400'} text-xs font-bold uppercase`}>{t.netMargin}</p>
                         {simulation.isLoss && <Skull className="text-red-500" size={18}/>}
                      </div>
                      <div className="flex items-baseline gap-1">
                          <span className={`text-3xl font-bold ${simulation.isLoss ? 'text-red-600' : 'text-emerald-600'}`}>
                              {Math.round(simulation.netMargin)}
                          </span>
                          <span className="text-sm font-medium text-slate-500">€/ha</span>
                      </div>
                      {simulation.riskMessage ? (
                          <div className="mt-2 text-[10px] bg-red-100 text-red-700 p-1.5 rounded font-bold animate-pulse leading-tight">
                              ⚠️ {simulation.riskMessage}
                          </div>
                      ) : (
                          <div className="mt-2 text-xs text-slate-400">
                             {t.costDeducted}
                          </div>
                      )}
                  </div>

                  {/* Eco Score Card */}
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-2xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
                      <Leaf className="absolute -bottom-6 -right-6 opacity-20" size={120} />
                      <div>
                          <p className="text-emerald-100 text-xs font-bold uppercase">{t.ecoScore}</p>
                          <div className="flex items-center gap-2">
                             <span className="text-4xl font-bold">{simulation.ecoScore}</span>
                             <span className="text-lg opacity-75">/ 100</span>
                          </div>
                      </div>
                      <div className="relative z-10">
                          <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 mb-1">
                              <div className="bg-white h-full rounded-full transition-all duration-1000" style={{width: `${simulation.ecoScore}%`}}></div>
                          </div>
                          <p className="text-xs text-emerald-50 font-medium">
                              {simulation.ecoScore > 90 ? t.ecoExcellent : simulation.ecoScore > 70 ? t.ecoSust : t.ecoNeedsImp}
                          </p>
                      </div>
                  </div>
              </div>

              {/* 3. Detailed Charts */}
              <div className="space-y-6">
                 
                 {/* Waterfall Chart */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Euro size={18} className="text-slate-400"/> {t.econBreakdown}
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={[
                                    { name: t.sales, value: Math.round(simulation.grossIncome), fill: '#3b82f6' },
                                    { name: t.subsidies, value: Math.round(simulation.subsidies), fill: '#10b981' },
                                    { name: t.totalCosts, value: -Math.round(simulation.totalCost), fill: '#ef4444' },
                                    // Add specific penalty bar if fine exists
                                    ...(simulation.envFine > 0 ? [{ name: t.envPenalty, value: -Math.round(simulation.envFine), fill: '#be123c' }] : []),
                                    { name: t.netProfit, value: Math.round(simulation.netMargin), fill: simulation.netMargin > 0 ? '#6366f1' : '#991b1b' },
                                ]}
                                layout="vertical"
                                margin={{ left: 10, right: 30 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={180} tick={{fontSize: 12, fill:'#64748b', fontWeight: 500}} />
                                <RechartsTooltip 
                                    formatter={(val: number) => [`${val} €`, t.amount]}
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                />
                                <ReferenceLine x={0} stroke="#94a3b8" />
                                <Bar dataKey="value" barSize={32} radius={[4, 4, 4, 4]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {simulation.totalCost > 2000 && (
                        <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 flex items-center gap-2">
                            <Info size={14} className="shrink-0"/>
                            {t.highCostWarn}
                        </div>
                    )}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Comparison: Crops */}
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                                <List size={16} className="text-slate-400"/> {t.cropComp}
                            </h3>
                            <div className="flex gap-2 mt-1">
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                                    {t.scenario}: {lang === 'en' ? CLIMATES[selectedClimate as keyof typeof CLIMATES].name.split(' ')[0] : CLIMATES[selectedClimate as keyof typeof CLIMATES].name_fr.split(' ')[0]}
                                </span>
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                                    {t.practice}: {lang === 'en' ? PRACTICES[selectedPractice as keyof typeof PRACTICES].short : PRACTICES[selectedPractice as keyof typeof PRACTICES].short_fr}
                                </span>
                            </div>
                        </div>
                        
                        <div className="h-60 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={compareCropsData} margin={{top: 10}}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} interval={0} />
                                    <YAxis hide />
                                    <RechartsTooltip contentStyle={{borderRadius: '12px'}} formatter={(val) => `${val} €`}/>
                                    <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                                        {compareCropsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.profit > 0 ? '#f59e0b' : '#ef4444'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                     </div>

                     {/* Comparison: Practices */}
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                                <TrendingUp size={16} className="text-slate-400"/> {t.pracComp}
                            </h3>
                            <div className="flex gap-2 mt-1">
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                                    {t.crop}: {lang === 'en' ? CROPS[selectedCrop as keyof typeof CROPS].name.split(' ')[0] : CROPS[selectedCrop as keyof typeof CROPS].name_fr.split(' ')[0]}
                                </span>
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                                    {t.scenario}: {lang === 'en' ? CLIMATES[selectedClimate as keyof typeof CLIMATES].name.split(' ')[0] : CLIMATES[selectedClimate as keyof typeof CLIMATES].name_fr.split(' ')[0]}
                                </span>
                            </div>
                        </div>
                        
                        <div className="h-60 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={comparePracticesData} margin={{top: 10}}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <RechartsTooltip contentStyle={{borderRadius: '12px'}} formatter={(val) => `${val} €`}/>
                                    <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                                        {comparePracticesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.profit > 0 ? (entry.name.includes(lang === 'en' ? PRACTICES[selectedPractice as keyof typeof PRACTICES].short : PRACTICES[selectedPractice as keyof typeof PRACTICES].short_fr) ? '#3b82f6' : '#cbd5e1') : '#f87171'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                     </div>
                 </div>

                 {/* Comparison: Regional Profitability (Moved to Bottom) */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="mb-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                            <Globe size={16} className="text-slate-400"/> {t.regComp}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            {t.regCompSub} <strong>{lang === 'en' ? CROPS[selectedCrop as keyof typeof CROPS].name : CROPS[selectedCrop as keyof typeof CROPS].name_fr}</strong> ({lang === 'en' ? PRACTICES[selectedPractice as keyof typeof PRACTICES].short : PRACTICES[selectedPractice as keyof typeof PRACTICES].short_fr}) {t.across}
                        </p>
                    </div>
                    
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={compareRegionsData} margin={{top: 10, bottom: 20}}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis 
                                    dataKey="name" 
                                    tick={{fontSize: 10, fill: '#64748b'}} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    interval={0}
                                    angle={-45}
                                    textAnchor="end"
                                />
                                <YAxis hide />
                                <RechartsTooltip contentStyle={{borderRadius: '12px'}} formatter={(val) => `${val} €`}/>
                                <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                                    {compareRegionsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.profit > 0 ? (entry.name === (lang === 'en' ? selectedRegion.name : selectedRegion.name_fr) ? '#3b82f6' : '#cbd5e1') : '#f87171'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </div>

              </div>
            </div>
          )}

        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-8 text-center text-xs text-slate-500 font-medium">
        <p>© 2025 AgriPilot France | Yang Su, École Normale Supérieure - PSL</p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}