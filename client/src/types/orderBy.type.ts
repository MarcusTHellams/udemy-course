export enum DirectionEnum {
    ASC = 'ASC',
    DESC = 'DESC',
}
export type OrderByType = {
    field: string;
    direction: DirectionEnum
}
