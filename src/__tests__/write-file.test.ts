import returnWriteFile from "../write-file";
import { writeFile } from "fs/promises";

jest.mock("@actions/core");
jest.mock("fs/promises");

let mockWriteFile = Promise.resolve();

jest.mock("fs/promises", () => {
  return { writeFile: jest.fn().mockImplementation(() => mockWriteFile) };
});

describe("returnWriteFile", () => {
  test("works", async () => {
    await returnWriteFile("my-file.yml", [
      { gameNumber: 100 },
      { gameNumber: 200 },
    ]);
    expect(writeFile.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "my-file.yml",
        "
        - gameNumber: 100
        - gameNumber: 200
      ",
      ]
    `);
  });
  test("error", async () => {
    mockWriteFile = Promise.reject("Error");
    await expect(returnWriteFile("my-file.yml", [])).rejects.toThrow("Error");
  });
});
