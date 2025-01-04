declare interface TargetProps {
  duedate: Date;
  type: "ShortMilestone" | "dreamMilestone";
  budget: number;
  itemName: string;
}