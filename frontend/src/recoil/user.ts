import { atom } from "recoil";

const loadFromLocalStorage = (key : any, defaultValue : any) => {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : defaultValue;
  };

export const userAtom = atom({
    key : "user",
    default: loadFromLocalStorage('user', {}),
    effects: [
        ({ onSet }) => {
          onSet((newValue) => {
            localStorage.setItem('user', JSON.stringify(newValue));
          });
        },
      ],
});