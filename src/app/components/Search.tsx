import * as React from "react";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useTranslations } from "next-intl";

export default function Search({
  handleChange,
}: {
  handleChange: React.Dispatch<React.SetStateAction<string>>;
}) {
  const t = useTranslations("dashboard");
  return (
    <FormControl
      sx={{ width: { xs: "100%", md: "25ch" }, flex: 1 }}
      variant="outlined"
    >
      <OutlinedInput
        size="small"
        id="search"
        placeholder={t("search")}
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: "text.primary" }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          "aria-label": "search for students by name",
        }}
        onChange={({ target }) => handleChange(target.value)}
      />
    </FormControl>
  );
}
