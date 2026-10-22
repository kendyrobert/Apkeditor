import { describe, it, expect } from "vitest";
import { parseVerify } from "../backend/src/services/rebuild";

describe("parseVerify", () => {
  it("detecta firma verificada y huella del certificado", () => {
    const out = "Verifies\nVerified using v1 scheme (JAR signing): true\nSigner #1 certificate SHA-256 digest: ab12cd34\n";
    expect(parseVerify(out)).toEqual({ verified: true, signerSha256: "ab12cd34" });
  });
  it("no marca como verificado si no aparece 'Verifies'", () => {
    expect(parseVerify("DOES NOT VERIFY").verified).toBe(false);
  });
});
