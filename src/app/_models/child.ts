import { Education } from "./education";
import { Region } from "./region";

export class Child {
    id: string;
    name: string;
    education: Education;
    region: Region;
    plannedAmount: number;
    actualAmount: number;
}