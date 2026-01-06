class BuildingManager {
  static buildings = [];
  static buildingTypes = {
    townhall: {
      name: 'Town Hall',
      baseCost: { gold: 0, wood: 0, stone: 0 },
      production: { gold: 10, wood: 0, stone: 0, food: 0 },
      maxLevel: 20
    },
    barracks: {
      name: 'Barracks',
      baseCost: { gold: 200, wood: 100, stone: 50 },
      production: { gold: 0, wood: 0, stone: 0, food: 0 },
      maxLevel: 15
    },
    quarry: {
      name: 'Quarry',
      baseCost: { gold: 150, wood: 50, stone: 0 },
      production: { gold: 0, wood: 0, stone: 5, food: 0 },
      maxLevel: 10
    },
    lumbermill: {
      name: 'Lumber Mill',
      baseCost: { gold: 100, wood: 0, stone: 25 },
      production: { gold: 0, wood: 8, stone: 0, food: 0 },
      maxLevel: 10
    },
    farm: {
      name: 'Farm',
      baseCost: { gold: 80, wood: 30, stone: 20 },
      production: { gold: 0, wood: 0, stone: 0, food: 12 },
      maxLevel: 8
    },
    market: {
      name: 'Market',
      baseCost: { gold: 300, wood: 150, stone: 100 },
      production: { gold: 15, wood: 0, stone: 0, food: 0 },
      maxLevel: 5
    }
  };

  static initialize(initialBuildings) {
    this.buildings = [...initialBuildings];
  }

  static getBuildings() {
    return [...this.buildings];
  }

  static getBuilding(id) {
    return this.buildings.find(building => building.id === id);
  }

  static canUpgrade(buildingId) {
    const building = this.getBuilding(buildingId);
    if (!building) return false;

    const buildingType = this.buildingTypes[building.type];
    return building.level < buildingType.maxLevel;
  }

  static getUpgradeCost(buildingId) {
    const building = this.getBuilding(buildingId);
    if (!building) return null;

    const buildingType = this.buildingTypes[building.type];
    const cost = {};
    
    Object.keys(buildingType.baseCost).forEach(resource => {
      cost[resource] = buildingType.baseCost[resource] * building.level;
    });

    return cost;
  }

  static upgradeBuilding(buildingId) {
    const building = this.getBuilding(buildingId);
    if (!building || !this.canUpgrade(buildingId)) return false;

    building.level += 1;
    return true;
  }

  static getProduction() {
    const totalProduction = { gold: 0, wood: 0, stone: 0, food: 0 };
    
    this.buildings.forEach(building => {
      const buildingType = this.buildingTypes[building.type];
      Object.keys(buildingType.production).forEach(resource => {
        totalProduction[resource] += buildingType.production[resource] * building.level;
      });
    });

    return totalProduction;
  }

  static addBuilding(type, x, y) {
    const buildingType = this.buildingTypes[type];
    if (!buildingType) return null;

    const newBuilding = {
      id: Date.now(),
      type: type,
      level: 1,
      x: x,
      y: y,
      name: buildingType.name
    };

    this.buildings.push(newBuilding);
    return newBuilding;
  }

  static removeBuilding(buildingId) {
    const index = this.buildings.findIndex(building => building.id === buildingId);
    if (index !== -1) {
      this.buildings.splice(index, 1);
      return true;
    }
    return false;
  }

  static getBuildingInfo(type) {
    return this.buildingTypes[type] || null;
  }

  static getAllBuildingTypes() {
    return { ...this.buildingTypes };
  }

  static getTotalLevel() {
    return this.buildings.reduce((total, building) => total + building.level, 0);
  }

  static getBuildingCount(type) {
    return this.buildings.filter(building => building.type === type).length;
  }
}

export default BuildingManager;