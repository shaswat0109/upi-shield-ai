import { describe, it, expect } from 'vitest';
import { analyzeMessage, analyzeUrl } from './engine';
describe('local detection', () => {
 it('keeps ordinary messages low risk',()=>expect(analyzeMessage('Dinner was Rs 450 each. Thanks!').level).toBe('Low'));
 it('flags credential pressure',()=>expect(analyzeMessage('Urgent account blocked. Share your OTP immediately.').score).toBeGreaterThanOrEqual(75));
 it('flags remote access reward scams',()=>expect(analyzeMessage('You won a prize. Pay a processing fee to receive it. Install AnyDesk.').level).toBe('Critical'));
 it('accepts ordinary HTTPS URLs',()=>expect(analyzeUrl('https://example.com').score).toBe(0));
 it('detects disguised destinations',()=>expect(analyzeUrl('http://bank.example@192.168.1.1/otp').score).toBeGreaterThanOrEqual(75));
 it('rejects invalid protocols',()=>expect(()=>analyzeUrl('javascript:alert(1)')).toThrow());
 it('rejects empty inputs',()=>expect(()=>analyzeMessage(' ')).toThrow());
 it('bounds scores',()=>expect(analyzeMessage('Urgent SBI blocked lottery prize share OTP pay to receive refund AnyDesk https://example.com').score).toBeLessThanOrEqual(100));
});
