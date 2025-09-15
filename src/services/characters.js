// Temporary compatibility layer for characters service
// TODO: Migrate to Clean Architecture

export const saveUserCharacterData = async (userId, characterData) => {
  console.log('saveUserCharacterData called with:', userId, characterData);
  // Temporary implementation - save to localStorage
  localStorage.setItem(`characterData_${userId}`, JSON.stringify(characterData));
};

export const getUserCharacterData = async (userId) => {
  console.log('getUserCharacterData called with:', userId);
  // Temporary implementation - load from localStorage
  const data = localStorage.getItem(`characterData_${userId}`);
  return data ? JSON.parse(data) : null;
};

export const initializeUserCharacterData = async (userId, characters) => {
  console.log('initializeUserCharacterData called with:', userId, characters);
  // Temporary implementation - return default data
  const defaultData = {
    userMoney: { A: 3, B: 2, C: 1, D: 1 },
    unlockedCharacters: characters.map(char => ({ ...char, unlocked: char.unlocked || false })),
    nickname: '내이름은뿌꾸',
    selectedCharacter: characters.find(char => char.unlocked) || characters[0]
  };
  
  await saveUserCharacterData(userId, defaultData);
  return defaultData;
};