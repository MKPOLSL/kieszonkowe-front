export class Child {
    id: string;
    // name: string;
    education: Education;
    region: Region;
    plannedAmount: number;
    actualAmount: number;
}

class Education {
    educationDegree: string;
    id: string;
}

class Region {
    regionName: string;
    id: string;
}