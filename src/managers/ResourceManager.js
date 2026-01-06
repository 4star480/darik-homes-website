class ResourceManager {
  static resources = {
    gold: 1000,
    wood: 500,
    stone: 300,
    food: 200
  };

  static initialize(initialResources) {
    this.resources = { ...initialResources };
  }

  static getResources() {
    return { ...this.resources };
  }

  static addResource(type, amount) {
    if (this.resources[type] !== undefined) {
      this.resources[type] += amount;
    }
  }

  static removeResource(type, amount) {
    if (this.resources[type] !== undefined) {
      this.resources[type] = Math.max(0, this.resources[type] - amount);
    }
  }

  static hasEnoughResources(cost) {
    return Object.keys(cost).every(resource => 
      this.resources[resource] >= cost[resource]
    );
  }

  static spendResources(cost) {
    if (!this.hasEnoughResources(cost)) {
      return false;
    }

    Object.keys(cost).forEach(resource => {
      this.resources[resource] -= cost[resource];
    });

    return true;
  }

  static updateResources() {
    // Simulate resource production over time
    // This would be called periodically in a real game
    this.resources.gold += 1;
    this.resources.wood += 0.5;
    this.resources.stone += 0.3;
    this.resources.food += 0.2;
  }
}

export default ResourceManager;