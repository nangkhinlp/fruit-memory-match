export let fruits = [];

export async function getData() {
  try {
    const response = await fetch("https://raw.githubusercontent.com/nangkhinlp/fruit-memory-match/refs/heads/main/data/data.json");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    fruits.push(...data.cardList);
    console.log("Loaded data:", data);
    return data;

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}