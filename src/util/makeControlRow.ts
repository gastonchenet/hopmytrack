import boxen from "boxen";
import chalk from "chalk";

export type Touch = {
  touch: string;
  control?: boolean;
  shift?: boolean;
};

export type Control = {
  label: string;
  binings: Touch[];
};

export function makeControlRow(controls: Control[]) {
  return boxen(
    " " +
      controls
        .map(
          (control) =>
            control.binings
              .map((binding) =>
                chalk.bgWhite.black(
                  " " +
                    (binding.control ? "Ctrl+" : "") +
                    (binding.shift ? "Shift+" : "") +
                    binding.touch.toUpperCase() +
                    " "
                )
              )
              .join(" ") +
            " " +
            control.label
        )
        .join(" ".repeat(6)),
    {
      width: Math.min(process.stdout.columns, 120),
      borderColor: "gray",
      borderStyle: "round",
    }
  );
}
