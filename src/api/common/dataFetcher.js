import request from '@/utils/request';

export async function fetchData(dataType) {
  let apiUrl;
  // 根据 dataType 动态选择 API 地址
  switch (dataType) {
    case 'petBreeds':
      apiUrl = '/encyclopedia/allBreed';
      break;
    case 'empJob':
      apiUrl = '/emp/allJob';
      break;
    case 'shoppingType':
      apiUrl = '/petShopping/allType';
      break;
    case 'petCoat':
      apiUrl = '/myPet/queryPetCoat';
      break;
    case 'petDetails':
      apiUrl = '/myPet/queryPetDetails';
      break;
    case 'serviceType':
      apiUrl = '/petService/allServiceType';
      break;
    default:
      console.error('未知的数据类型');
      return [];
  }

  try {
    const response = await getCommonData(dataType, apiUrl);
    return response.data; // 获取数据
  } catch (error) {
    console.error(`获取${dataType}失败`, error);
    return []; // 返回空数组表示请求失败
  }
}


// 从后端获取通用数据
export function getCommonData(dataType, url) {
    return request({
      url: url,
      method: 'get',
      params: { dataType }
    });
  }