import Command from "@/structures/Command.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import axios from "axios";
let cities: {
  name: string;
  lat: string;
  lng: string;
  country: string;
  admin1: string;
  admin2: string;
}[];
export default new Command({
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Check weather of a city")
    .addStringOption((city) =>
      city
        .setName("city")
        .setDescription("The city to check the weather of")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async run(client, interaction) {
    const city = interaction.options.getString("city", true);
    const lat = city.split("|")[0];
    const long = city.split("|")[1];
    await interaction.deferReply();
    const response = await axios
      .get<WeatherApiResponse>(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${client.config.OPENWEATHERMAP_KEY}`
      )
      .catch(() => {
        return;
      });
    if (!response) return await interaction.editReply("Wrong coords");
    const desc = [
      `Latitudes: ${response.data.coord.lat}`,
      `Longitudes: ${response.data.coord.lon}`,
      `Weather: ${response.data.weather[0].description}`,
      `Temperature: ${response.data.main.temp}°C (min ${response.data.main.temp_min}°C | max ${response.data.main.temp_max}°C)`,
      `Feels like: ${response.data.main.feels_like}°C`,
      `Wind speed: ${response.data.wind.speed}`,
    ];
    const embed = new EmbedBuilder()
      .setTitle(`Weather Information - ${response.data.name}`)
      .setDescription(desc.join("\n"));
    await interaction.editReply({
      embeds: [embed],
    });
  },
  async autocomplete(client, interaction) {
    const focused = interaction.options.getFocused();
    if (!cities)
      cities = (
        await import("cities.json", {
          assert: {
            type: "json",
          },
        })
      ).default as typeof cities;
    const city = Array.from(
      new Set([
        ...cities.filter((v) =>
          v.name.toLowerCase().startsWith(focused.toLowerCase())
        ),
        ...cities.filter((v) =>
          v.name.toLowerCase().includes(focused.toLowerCase())
        ),
      ])
    );
    await interaction.respond(
      city && focused
        ? city
            .map((v) => ({ name: v.name, value: `${v.lat}|${v.lng}` }))
            .slice(0, 25)
        : cities
            .slice(0, 25)
            .map((v) => ({ name: v.name, value: `${v.lat}|${v.lng}` }))
    );
  },
});
interface WeatherApiResponse {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  rain: Rain;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface Sys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

interface Clouds {
  all: number;
}

interface Rain {
  "1h": number;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Coord {
  lon: number;
  lat: number;
}
