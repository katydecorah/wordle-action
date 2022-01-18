import returnReadFile from "../read-file";
import { promises } from "fs";
import { setFailed } from "@actions/core";

jest.mock("@actions/core");

describe("returnReadFile", () => {
  test("works", async () => {
    const mockReadFile = jest.spyOn(promises, "readFile");
    await returnReadFile("my-file.yml");
    expect(mockReadFile.mock.calls[0]).toEqual(["my-file.yml", "utf-8"]);
  });
  test("error", async () => {
    jest.spyOn(promises, "readFile").mockRejectedValue({ message: "Error" });
    await returnReadFile("my-file.yml");
    expect(setFailed).toHaveBeenCalledWith("Error");
  });
});
