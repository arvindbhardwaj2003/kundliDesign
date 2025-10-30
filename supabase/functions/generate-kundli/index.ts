import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BirthData {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  utcOffset: string;
  latitude: number;
  longitude: number;
}

interface ChartHouse {
  sign_num: number;
  asc?: string | null;
  planets: string[] | Record<string, string>;
}

interface Chart {
  [house: string]: ChartHouse;
}

const navamasa_mfd = {
  move: [1, 4, 7, 10],
  fixed: [2, 5, 8, 11],
  dual: [3, 6, 9, 12],
};

const navamasa_degree = [
  [0, 3.2, 6.4, 10, 13.2, 16.4, 20, 23.2, 26.4],
  [3.2, 6.4, 10, 13.2, 16.4, 20, 23.2, 26.4, 30],
];

function getMoonChart(lagnaKundli: Chart): Chart {
  const houses: Chart = {};
  for (let i = 1; i <= 12; i++) {
    houses[i.toString()] = { sign_num: 0, asc: null, planets: [] };
  }

  let first_house = 0;
  for (const item in lagnaKundli) {
    const planetsList = Array.isArray(lagnaKundli[item].planets)
      ? lagnaKundli[item].planets
      : Object.keys(lagnaKundli[item].planets);
    if (planetsList.length !== 0 && planetsList.includes("Mo")) {
      first_house = lagnaKundli[item].sign_num;
      break;
    }
  }

  houses["1"].sign_num = first_house;
  for (let i = 2; i <= 12; i++) {
    first_house += 1;
    if (first_house > 12) first_house = 1;
    houses[i.toString()].sign_num = first_house;
    if (houses[i.toString()].sign_num === lagnaKundli["1"].sign_num) {
      houses[i.toString()].asc = lagnaKundli["1"].asc || null;
    }
  }

  for (const item in lagnaKundli) {
    const itemPlanets = lagnaKundli[item].planets;
    const planetsList = Array.isArray(itemPlanets)
      ? itemPlanets
      : Object.keys(itemPlanets);
    if (planetsList.length !== 0) {
      for (const house in houses) {
        if (houses[house].sign_num === lagnaKundli[item].sign_num) {
          for (const planet of planetsList) {
            (houses[house].planets as string[]).push(planet);
          }
        }
      }
    }
  }
  return houses;
}

function getStartCount(
  sign_num: number,
  pos: number,
  current_house: number
): [number, number] {
  let start_house = 0;

  if (navamasa_mfd.move.includes(sign_num)) {
    start_house = current_house;
    for (let i = 0; i < navamasa_degree[0].length; i++) {
      if (pos >= navamasa_degree[0][i] && pos <= navamasa_degree[1][i]) {
        const house_to_count = i + 1;
        return [start_house + 1, house_to_count];
      }
    }
  } else if (navamasa_mfd.fixed.includes(sign_num)) {
    start_house =
      9 + current_house <= 12
        ? 9 + current_house
        : 9 + current_house - 12;
    for (let i = 0; i < navamasa_degree[0].length; i++) {
      if (pos >= navamasa_degree[0][i] && pos <= navamasa_degree[1][i]) {
        const house_to_count = i + 1;
        return [start_house, house_to_count];
      }
    }
  } else if (navamasa_mfd.dual.includes(sign_num)) {
    start_house =
      5 + current_house <= 12
        ? 5 + current_house
        : 5 + current_house - 12;
    for (let i = 0; i < navamasa_degree[0].length; i++) {
      if (pos >= navamasa_degree[0][i] && pos <= navamasa_degree[1][i]) {
        const house_to_count = i + 1;
        return [start_house, house_to_count];
      }
    }
  }
  return [1, 1];
}

function parsePosition(posStr: string): number {
  const cleaned = posStr.replace(/[+>]/g, "");
  const parts = cleaned.match(/(\d+)°(\d+)'(\d+)"/)
  if (!parts) return 0;
  const degrees = parseInt(parts[1]);
  const minutes = parseInt(parts[2]);
  return parseFloat(`${degrees}.${minutes}`);
}

function navamsaChart(kundli: Chart): Chart {
  const ascPos = kundli["1"].asc ? parsePosition(kundli["1"].asc) : 0;
  const asc = [parseInt(kundli["1"].sign_num.toString()), ascPos];

  const houses: Chart = {};
  for (let i = 1; i <= 12; i++) {
    houses[i.toString()] = {
      sign_num: i,
      planets: [],
    };
  }
  if (kundli["1"].asc) {
    houses["1"].asc = kundli["1"].asc;
  }

  const count_house = getStartCount(asc[0], asc[1], 0);
  let temp = count_house[0] - 1;
  for (let i = 0; i < count_house[1]; i++) {
    temp += 1;
    if (temp > 12) temp = 1;
  }

  for (let i = 0; i < 12; i++) {
    houses[(i + 1).toString()].sign_num = kundli[temp.toString()].sign_num;
    temp += 1;
    if (temp > 12) temp = temp - 12;
  }

  for (const house in kundli) {
    const housePlanets = kundli[house].planets;
    if (
      (Array.isArray(housePlanets) && housePlanets.length !== 0) ||
      (!Array.isArray(housePlanets) && Object.keys(housePlanets).length !== 0)
    ) {
      const planetsObj = Array.isArray(housePlanets)
        ? {}
        : (housePlanets as Record<string, string>);
      for (const item in planetsObj) {
        const planetPos = parsePosition(planetsObj[item]);
        const count_house = getStartCount(
          kundli[house].sign_num,
          planetPos,
          parseInt(house) - 1
        );
        let temp = count_house[0] - 1;
        for (let i = 0; i < count_house[1]; i++) {
          temp += 1;
          if (temp > 12) temp = 1;
        }

        const rashi = kundli[temp.toString()].sign_num;
        for (const i in houses) {
          if (houses[i].sign_num === rashi) {
            (houses[i].planets as string[]).push(item);
          }
        }
      }
    }
  }
  return houses;
}

function generateMockKundli(birthData: BirthData): {
  lagna: Chart;
  navamsa: Chart;
  moon: Chart;
  transit: Chart;
} {
  const mockLagna: Chart = {
    "1": { sign_num: 1, asc: ">00°45'23\"", planets: { Asc: ">00°45'23\"" } },
    "2": { sign_num: 2, planets: { Me: ">05°12'45\"" } },
    "3": { sign_num: 3, planets: {} },
    "4": { sign_num: 4, planets: { Mo: ">12°30'10\"" } },
    "5": { sign_num: 5, planets: { Su: ">18°22'33\"", Ve: ">20°15'44\"" } },
    "6": { sign_num: 6, planets: {} },
    "7": { sign_num: 7, planets: { Ma: ">25°40'12\"" } },
    "8": { sign_num: 8, planets: {} },
    "9": { sign_num: 9, planets: { Ju: ">08°55'20\"" } },
    "10": { sign_num: 10, planets: {} },
    "11": { sign_num: 11, planets: { Sa: ">15°18'30\"" } },
    "12": { sign_num: 12, planets: { Ra: ">22°10'05\"", Ke: ">22°10'05\"" } },
  };

  const navamsa = navamsaChart(mockLagna);
  const moon = getMoonChart(mockLagna);
  const transit = JSON.parse(JSON.stringify(mockLagna));

  return {
    lagna: mockLagna,
    navamsa,
    moon,
    transit,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const birthData: BirthData = await req.json();

    const { name, year, month, day, hour, minute, utcOffset, latitude, longitude } = birthData;

    if (!name || !year || !month || !day || hour === undefined || minute === undefined || !utcOffset || !latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const birthDateTime = new Date(year, month - 1, day, hour, minute);

    const charts = generateMockKundli(birthData);

    const { data, error } = await supabase
      .from("kundli_charts")
      .insert({
        name,
        birth_datetime: birthDateTime.toISOString(),
        latitude,
        longitude,
        utc_offset: utcOffset,
        lagna_chart: charts.lagna,
        navamsa_chart: charts.navamsa,
        moon_chart: charts.moon,
        transit_chart: charts.transit,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
