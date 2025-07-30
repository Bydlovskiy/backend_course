export interface IMailService {
  send(to: string, from: string, templateId: string, vars: Record<string, string>): Promise<void>;
}