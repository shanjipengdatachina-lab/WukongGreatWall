export interface AncientCity {
  id: string
  name: string
  ancientName: string
  dynasty: string
  longitude: number
  latitude: number
  description: string
}

export interface MajorCity {
  id: string
  name: string
  province: string
  longitude: number
  latitude: number
  population: number
}

export interface RoadSegment {
  id: string
  name: string
  type: 'highway' | 'ancient_road' | 'great_wall'
  coords: [number, number][]
  description: string
}

export const ancientCities: AncientCity[] = [
  { id: 'AC001', name: '西安', ancientName: '长安', dynasty: '西周/秦/汉/唐', longitude: 108.94, latitude: 34.34, description: '十三朝古都，丝绸之路起点' },
  { id: 'AC002', name: '洛阳', ancientName: '洛邑', dynasty: '夏/商/周/汉/唐', longitude: 112.45, latitude: 34.62, description: '十三朝古都，中华文明发祥地' },
  { id: 'AC003', name: '南京', ancientName: '金陵', dynasty: '东吴/东晋/宋/齐/梁/陈', longitude: 118.78, latitude: 32.04, description: '六朝古都，江南文化中心' },
  { id: 'AC004', name: '北京', ancientName: '燕京', dynasty: '辽/金/元/明/清', longitude: 116.40, latitude: 39.90, description: '五朝古都，现今首都' },
  { id: 'AC005', name: '开封', ancientName: '汴京', dynasty: '北宋', longitude: 114.31, latitude: 34.80, description: '北宋都城，当时世界最大城市' },
  { id: 'AC006', name: '杭州', ancientName: '临安', dynasty: '南宋', longitude: 120.15, latitude: 30.28, description: '南宋都城，江南水乡' },
  { id: 'AC007', name: '安阳', ancientName: '殷墟', dynasty: '商朝', longitude: 114.39, latitude: 36.10, description: '商朝晚期都城，甲骨文发源地' },
  { id: 'AC008', name: '郑州', ancientName: '商都', dynasty: '商朝早期', longitude: 113.65, latitude: 34.76, description: '商朝早期都城' },
  { id: 'AC009', name: '大同', ancientName: '平城', dynasty: '北魏', longitude: 113.30, latitude: 40.08, description: '北魏都城，云冈石窟所在地' },
  { id: 'AC010', name: '成都', ancientName: '锦官城', dynasty: '蜀汉/前蜀/后蜀', longitude: 104.06, latitude: 30.67, description: '天府之国，蜀文化中心' },
  { id: 'AC011', name: '平遥', ancientName: '古陶', dynasty: '明/清', longitude: 112.17, latitude: 37.20, description: '保存最完整的汉族古城' },
  { id: 'AC012', name: '丽江', ancientName: '丽江古城', dynasty: '宋/元/明/清', longitude: 100.23, latitude: 26.87, description: '纳西族古城，世界文化遗产' },
  { id: 'AC013', name: '敦煌', ancientName: '沙州', dynasty: '汉/唐', longitude: 94.66, latitude: 40.14, description: '丝绸之路重镇，莫高窟所在地' },
  { id: 'AC014', name: '苏州', ancientName: '姑苏', dynasty: '春秋吴国', longitude: 120.58, latitude: 31.30, description: '吴文化发源地，园林之城' },
  { id: 'AC015', name: '荆州', ancientName: '江陵', dynasty: '楚/南朝', longitude: 112.24, latitude: 30.34, description: '楚文化中心，六朝古都' },
  { id: 'AC016', name: '曲阜', ancientName: '曲阜', dynasty: '鲁国', longitude: 117.00, latitude: 35.59, description: '孔子故乡，儒家文化发源地' },
  { id: 'AC017', name: '咸阳', ancientName: '咸阳', dynasty: '秦', longitude: 108.71, latitude: 34.33, description: '秦国都城，秦始皇统一六国' },
  { id: 'AC018', name: '邯郸', ancientName: '邯郸', dynasty: '赵国', longitude: 114.49, latitude: 36.61, description: '赵国都城，成语典故之乡' },
]

export const majorCities: MajorCity[] = [
  { id: 'MC001', name: '北京', province: '北京', longitude: 116.40, latitude: 39.90, population: 2189 },
  { id: 'MC002', name: '上海', province: '上海', longitude: 121.47, latitude: 31.23, population: 2487 },
  { id: 'MC003', name: '广州', province: '广东', longitude: 113.26, latitude: 23.13, population: 1881 },
  { id: 'MC004', name: '深圳', province: '广东', longitude: 114.06, latitude: 22.54, population: 1756 },
  { id: 'MC005', name: '成都', province: '四川', longitude: 104.06, latitude: 30.67, population: 2119 },
  { id: 'MC006', name: '重庆', province: '重庆', longitude: 106.55, latitude: 29.56, population: 3205 },
  { id: 'MC007', name: '武汉', province: '湖北', longitude: 114.31, latitude: 30.52, population: 1365 },
  { id: 'MC008', name: '西安', province: '陕西', longitude: 108.94, latitude: 34.34, population: 1295 },
  { id: 'MC009', name: '杭州', province: '浙江', longitude: 120.15, latitude: 30.28, population: 1220 },
  { id: 'MC010', name: '南京', province: '江苏', longitude: 118.78, latitude: 32.04, population: 942 },
  { id: 'MC011', name: '天津', province: '天津', longitude: 117.20, latitude: 39.13, population: 1387 },
  { id: 'MC012', name: '苏州', province: '江苏', longitude: 120.58, latitude: 31.30, population: 1275 },
  { id: 'MC013', name: '郑州', province: '河南', longitude: 113.65, latitude: 34.76, population: 1260 },
  { id: 'MC014', name: '长沙', province: '湖南', longitude: 112.94, latitude: 28.23, population: 1004 },
  { id: 'MC015', name: '沈阳', province: '辽宁', longitude: 123.43, latitude: 41.80, population: 907 },
  { id: 'MC016', name: '青岛', province: '山东', longitude: 120.38, latitude: 36.07, population: 1007 },
  { id: 'MC017', name: '济南', province: '山东', longitude: 117.00, latitude: 36.65, population: 920 },
  { id: 'MC018', name: '哈尔滨', province: '黑龙江', longitude: 126.64, latitude: 45.75, population: 1001 },
  { id: 'MC019', name: '大连', province: '辽宁', longitude: 121.62, latitude: 38.92, population: 745 },
  { id: 'MC020', name: '厦门', province: '福建', longitude: 118.08, latitude: 24.48, population: 528 },
]

export const roadSegments: RoadSegment[] = [
  {
    id: 'GW001',
    name: '万里长城（山海关-嘉峪关）',
    type: 'great_wall',
    description: '明代长城主线，世界文化遗产',
    coords: [
      [119.76, 40.00],
      [118.40, 40.35],
      [117.24, 40.65],
      [116.57, 40.43],
      [116.20, 40.56],
      [115.98, 40.47],
      [115.54, 40.45],
      [115.22, 40.55],
      [114.50, 40.65],
      [114.00, 40.60],
      [113.30, 40.08],
      [112.50, 39.80],
      [112.00, 39.50],
      [111.50, 39.60],
      [111.00, 39.70],
      [110.20, 40.20],
      [109.80, 39.90],
      [109.00, 39.60],
      [108.00, 39.50],
      [107.00, 39.80],
      [106.00, 39.50],
      [105.00, 38.50],
      [104.00, 38.00],
      [103.00, 37.50],
      [102.00, 37.20],
      [100.50, 37.80],
      [99.00, 39.00],
      [97.80, 39.70],
      [96.20, 39.85],
      [94.66, 40.14],
    ],
  },
  {
    id: 'AR001',
    name: '丝绸之路（主线）',
    type: 'ancient_road',
    description: '古代东西方贸易通道',
    coords: [
      [108.94, 34.34],
      [104.06, 30.67],
      [101.78, 36.62],
      [94.66, 40.14],
      [87.62, 43.82],
      [75.99, 39.45],
    ],
  },
  {
    id: 'AR002',
    name: '京杭大运河',
    type: 'ancient_road',
    description: '世界最长的古代运河',
    coords: [
      [116.40, 39.90],
      [117.20, 39.13],
      [116.57, 37.45],
      [116.99, 36.65],
      [117.00, 34.26],
      [118.78, 32.04],
      [120.58, 31.30],
      [120.15, 30.28],
      [120.65, 27.99],
    ],
  },
  {
    id: 'HW001',
    name: '京哈高速',
    type: 'highway',
    description: '北京-哈尔滨高速公路',
    coords: [
      [116.40, 39.90],
      [118.40, 39.63],
      [121.62, 38.92],
      [122.28, 41.12],
      [123.43, 41.80],
      [125.32, 43.90],
      [126.64, 45.75],
    ],
  },
  {
    id: 'HW002',
    name: '京沪高速',
    type: 'highway',
    description: '北京-上海高速公路',
    coords: [
      [116.40, 39.90],
      [117.20, 39.13],
      [117.00, 36.65],
      [118.78, 32.04],
      [120.58, 31.30],
      [121.47, 31.23],
    ],
  },
  {
    id: 'HW003',
    name: '京广高铁',
    type: 'highway',
    description: '北京-广州高速铁路',
    coords: [
      [116.40, 39.90],
      [114.52, 38.04],
      [113.65, 34.76],
      [114.31, 30.52],
      [112.94, 28.23],
      [113.26, 23.13],
    ],
  },
  {
    id: 'HW004',
    name: '沪昆高铁',
    type: 'highway',
    description: '上海-昆明高速铁路',
    coords: [
      [121.47, 31.23],
      [120.15, 30.28],
      [118.78, 32.04],
      [115.89, 28.68],
      [113.00, 28.21],
      [106.71, 26.57],
      [104.06, 30.67],
      [102.71, 25.04],
    ],
  },
  {
    id: 'HW005',
    name: '陇海线',
    type: 'highway',
    description: '连云港-兰州铁路干线',
    coords: [
      [119.16, 34.59],
      [117.00, 34.26],
      [114.31, 34.80],
      [112.45, 34.62],
      [108.94, 34.34],
      [103.83, 36.06],
    ],
  },
]
