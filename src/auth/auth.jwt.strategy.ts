import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtStrategy {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async verify(token: string): Promise<any> {
    return this.jwtService.verify(token);
  }
}
