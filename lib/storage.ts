import AsyncStorage from "@react-native-async-storage/async-storage";

const word_KEY = "words";

export type word = {
  id: string;
  word: string;
  translation: string;
  sentence: string;
  category: string;
};

export async function getwords(): Promise<word[]> {
  const wordsString = await AsyncStorage.getItem(word_KEY);
  if (!wordsString) {
    return [];
  }
  return JSON.parse(wordsString) as word[];
}

export async function setwords(words: word[]): Promise<void> {
  await AsyncStorage.setItem(word_KEY, JSON.stringify(words));
}

export async function deleteword(id: string): Promise<void> {
  const words = await getwords();
  const updatedwords = words.filter((word) => word.id !== id);
  await setwords(updatedwords);
}
