import { Ref, watch, reactive, toRefs } from 'vue';

const instances: Record<string, Ref<any>> = {};

export default function useLocalStorage(key: string, defaultValue: any): Ref<any> {
  if (instances[key]) {
    return instances[key];
  }

  const data = reactive({
    value: defaultValue
  });

  try {
    const valueInLocalStorage = localStorage.getItem(key);
    if (valueInLocalStorage) {
      data.value = JSON.parse(valueInLocalStorage);
    } else {
      data.value = defaultValue;
    }
  } catch (e) {
    console.error(e);
  }

  watch(
    () => data.value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    {
      deep: true
    }
  );

  instances[key] = toRefs(data).value;
  return instances[key];
}
