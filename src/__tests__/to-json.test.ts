import toJson from "../to-json";

jest.mock("@actions/core");

let mockRead = Promise.resolve("- gameNumber: 100");

jest.mock("../read-file", () => {
  return jest.fn().mockImplementation(() => mockRead);
});

describe("toJson", () => {
  test("works", async () => {
    expect(await toJson("my-file.yml")).toEqual([{ gameNumber: 100 }]);
  });
  test("error", async () => {
    mockRead = Promise.reject("Error");
    await expect(toJson("my-file.yml")).rejects.toThrow("Error");
  });
});
