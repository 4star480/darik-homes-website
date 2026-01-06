class HeroManager {
  static heroes = [];
  static unlockedHeroes = [];

  static initialize(initialHeroes) {
    this.heroes = [...initialHeroes];
    this.unlockedHeroes = initialHeroes.filter(hero => hero.isUnlocked);
  }

  static getHeroes() {
    return [...this.heroes];
  }

  static getUnlockedHeroes() {
    return [...this.unlockedHeroes];
  }

  static unlockHero(heroId) {
    const hero = this.heroes.find(h => h.id === heroId);
    if (hero && !hero.isUnlocked) {
      hero.isUnlocked = true;
      this.unlockedHeroes.push(hero);
      return true;
    }
    return false;
  }

  static upgradeHero(heroId) {
    const hero = this.heroes.find(h => h.id === heroId);
    if (hero && hero.isUnlocked) {
      hero.level += 1;
      hero.attack += 10;
      hero.defense += 5;
      hero.health += 20;
      return true;
    }
    return false;
  }

  static getHeroPower(heroId) {
    const hero = this.heroes.find(h => h.id === heroId);
    if (hero && hero.isUnlocked) {
      return hero.level * (hero.attack + hero.defense + hero.health);
    }
    return 0;
  }

  static getTotalPower() {
    return this.unlockedHeroes.reduce((total, hero) => {
      return total + this.getHeroPower(hero.id);
    }, 0);
  }

  static rollGacha() {
    // Simulate gacha roll
    const rarities = ['common', 'rare', 'epic', 'legendary'];
    const weights = [0.6, 0.3, 0.08, 0.02];
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < rarities.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return this.generateRandomHero(rarities[i]);
      }
    }
    
    return this.generateRandomHero('common');
  }

  static generateRandomHero(rarity) {
    const names = {
      common: ['Knight', 'Archer', 'Mage', 'Warrior'],
      rare: ['Paladin', 'Ranger', 'Wizard', 'Berserker'],
      epic: ['Dragon Knight', 'Shadow Assassin', 'Storm Mage', 'Battle Lord'],
      legendary: ['King Arthur', 'Merlin', 'Excalibur', 'Phoenix']
    };

    const randomName = names[rarity][Math.floor(Math.random() * names[rarity].length)];
    
    return {
      id: Date.now(),
      name: randomName,
      type: 'knight',
      level: 1,
      rarity: rarity,
      attack: this.getBaseStats(rarity).attack,
      defense: this.getBaseStats(rarity).defense,
      health: this.getBaseStats(rarity).health,
      skills: this.getSkills(rarity),
      isUnlocked: false
    };
  }

  static getBaseStats(rarity) {
    const stats = {
      common: { attack: 50, defense: 30, health: 100 },
      rare: { attack: 75, defense: 45, health: 150 },
      epic: { attack: 100, defense: 60, health: 200 },
      legendary: { attack: 150, defense: 90, health: 300 }
    };
    return stats[rarity];
  }

  static getSkills(rarity) {
    const skills = {
      common: ['Basic Attack', 'Defend'],
      rare: ['Power Strike', 'Shield Block', 'Rally'],
      epic: ['Lightning Strike', 'Iron Will', 'Battle Cry', 'Counter Attack'],
      legendary: ['Divine Strike', 'Immortal Will', 'King\'s Command', 'Legendary Roar', 'God\'s Blessing']
    };
    return skills[rarity];
  }
}

export default HeroManager;