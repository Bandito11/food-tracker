export interface IResponse<T> {
    success: boolean;
    error: string;
    dateStamp: Date;
    data: T;
    message: any;
}

/**
 * Date Format: MM/DD/YYYY
 */
export interface IDaily {
    date: string;
    calories: string;
    breakfast: IMeal[];
    breakfastSnack: IMeal[];
    lunch: IMeal[];
    lunchSnack: IMeal[];
    dinner: IMeal[];
    dinnerSnack: IMeal[];
}


export interface IDailyEntry {
    date: Date;
    type: string
    consumedSize: string;
    foodProduct: IFoodProduct
}

//TODO: To delete
// export interface IEntry {
//     date: Date;
//     productId: string;
//     type: string
//     consumedSize: string;
// }

interface IMeal extends IFoodProduct {
    id?: number;
    calories: string;
}

//TODO: To delete
// interface IMeasurement {
//     size: string;
//     grams: string;
//     measurement: string;
// }

export interface IFoodProduct extends INutritionFacts {
    name: string;
    barcode: string;
    picture: string;
    dateCreated: Date;
}

export interface INutritionFacts {
    servingSize: {
        size: string;
        grams: string;
        measurement: string;
    };
    servingPerContainer: string;
    calories: string;
    fat: {
        total: IAmount;
        saturated: IAmount;
        trans: IAmount;
        polyunsaturated: IAmount;
        monounsaturated: IAmount;
    };
    cholesterol: IAmount;
    sodium: IAmount;
    potassium: IAmount;
    totalCarbohydrates: IAmount;
    dietaryFiber: IAmount;
    protein: IAmount;
    niacin: IAmount;
    phosphorus: IAmount;
    calcium: IAmount;
    iron: IAmount;
    magnesium: IAmount;
    manganese: IAmount;
    vitamin: {
        A: IAmount;
        B: IAmount;
        C: IAmount;
        D: IAmount;
        E: IAmount;
    };
    sugar: ISugar;
    sugarAlcohol: ISugar;
}

interface ISugar {
    added: IAmount;
    total: IAmount
}

interface IAmount {
    grams: string;
    percent: string;
}

export interface IUSDA {
    databaseNumber: number;
    foodGroup: string;
    foodName: string;
    protein: number;// (g)
    fat: number;// (g)
    carbohydrates: number;// (g)
    ash: number;// (g)
    calories;
    starch: number;// (g)
    sucrose: number;// (g)
    glucose: number;// (g)
    fructose: number;// (g)
    lactose: number;// (g)
    maltose: number;// (g)
    alcohol: number;// (g)
    water: number;// (g)
    caffeine: number; // (mg)
    theobromine: number; // (mg)
    sugar: number;// (g)
    galactose: number;// (g)
    fiber: number;// (g)
    calcium: number; // (mg)
    iron: number; // (mg)
    magnesium: number; // (mg)
    phosphorus: number; // (mg)
    potasssium: number; // (mg)
    sodium: number; // (mg)
    zinc: number; // (mg)
    cupper: number; // (mg)
    fluoride: number;// (mcg)
    manganese: number; // (mg)
    selenium: number;// (mcg)
    vitaminA: number;// (IU)
    retinol: number;// (mcg)
    retinolEquivalents: number;// (mcg)
    betaCarotene: number;// (mcg)
    alphaCarotene: number;// (mcg)
    vitaminE: number; // (mg)
    vitaminD: number;// (mcg)
    vitaminD2: number; // (Ergocalciferol)  (mcg)
    vitaminD3: number; // (Cholecalciferol)  (mcg)
    betaCryptoxanthin: number;// (mcg)
    lycopene: number;// (mcg)
    luteinAndZeaxanthin: number;// (mcg)
    vitaminC: number; // (mg)
    thiamin: number; // (mg)
    riboflavin: number; // (mg)
    niacin: number; // (mg)
    vitaminB5: number; // (mg)
    vitaminB6: number; // (mg)
    folate: number; // (mg)
    vitaminB12: number;
    choline: number; // (mg)
    cholesterol: number; // (mg)
    saturatedFat: number;// (g)
    netCarbs: number;
}