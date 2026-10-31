export type Level = 'Low' | 'Medium' | 'High' | 'Critical';
export type Signal = { title: string; explanation: string; weight: number };
export type Assessment = { score: number; level: Level; signals: Signal[]; actions: string[] };
export type Scan = Assessment & { id: string; type: 'Message' | 'URL'; input: string; timestamp: string };
const finish = (signals: Signal[]): Assessment => {
 const score = Math.min(100, signals.reduce((sum, s) => sum + s.weight, 0));
 return {score, level: score >= 75 ? 'Critical' : score >= 45 ? 'High' : score >= 20 ? 'Medium' : 'Low', signals, actions: score >= 20 ? ['Pause before responding or paying.', 'Verify the request independently using the official app or a known contact.', 'Never share your UPI PIN or OTP. Do not install remote-access apps on request.'] : ['Verify the recipient and amount before paying.', 'Keep your UPI PIN and OTP private. A low score does not guarantee safety.']};
};
export function analyzeMessage(input: string): Assessment {
 if (!input.trim()) throw new Error('Enter a message to analyze.');
 const rules: [RegExp, string, string, number][] = [
 [/urgent|immediately|within \d+|act now|last chance/i,'Urgency pressure','A short deadline can pressure you into skipping verification.',20],
 [/block(?:ed)?|suspend|arrest|disconnect|legal action/i,'Threat or account restriction','Threats of losing access or legal action can be used to force a response.',20],
 [/lottery|won\b|prize|reward|cashback.*claim/i,'Unexpected reward','Unsolicited rewards can lure you into sharing information or making a payment.',20],
 [/\b(bank|sbi|hdfc|paytm|phonepe|government|support team|kyc)\b/i,'Claimed institutional identity','The sender claims a trusted identity; the text cannot authenticate that claim.',10],
 [/(share|send|tell|enter|provide|verify).{0,35}(otp|pin|password)|(?:otp|pin|password).{0,25}(share|send|verify)/i,'Credential request','Requests to disclose or enter credentials deserve independent verification.',40],
 [/pay.{0,30}(receive|refund|reward)|scan.{0,30}(receive|refund)|collect request|processing fee/i,'Suspicious payment instruction','Paying a fee or approving a collect request to receive money is a warning sign.',30],
 [/anydesk|teamviewer|remote.?access|screen.?shar/i,'Remote access request','Remote access or screen sharing could expose your payment apps and credentials.',40],
 [/https?:\/\//i,'Embedded link','Inspect the destination separately. A link alone is not proof of fraud.',5]];
 return finish(rules.filter(([pattern]) => pattern.test(input)).map(([,title,explanation,weight])=>({title,explanation,weight})));
}
export function analyzeUrl(input: string): Assessment {
 let url: URL;
 try { url = new URL(input.trim()); } catch { throw new Error('Enter a complete URL, including https:// or http://.'); }
 if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) throw new Error('Enter a valid HTTP or HTTPS website URL.');
 const signals: Signal[]=[];
 const add=(test:boolean,title:string,explanation:string,weight:number)=>{if(test) signals.push({title,explanation,weight});};
 const host=url.hostname.toLowerCase();
 add(url.protocol==='http:','Unencrypted connection','HTTP does not protect data in transit.',20);
 add(/(^|\.)(bit\.ly|tinyurl\.com|t\.co|rb\.gy|shorturl\.at)$/.test(host),'Shortened destination','A short link conceals the final destination; it is not automatically malicious.',20);
 add(/^(\d{1,3}\.){3}\d{1,3}$/.test(host)||host.includes(':'),'IP-address host','An address instead of a named domain is unusual for a payment service.',30);
 add(/xn--|[^\x00-\x7F]/.test(host),'Encoded or unusual domain','Internationalized domains can resemble other brands. Check the exact spelling.',20);
 add(!!url.username||!!url.password,'Embedded user information','Text before @ can make a destination appear to be another website.',30);
 add(host.split('.').length>3||host.length>45,'Complex hostname','Many subdomains or a long name can hide the actual destination.',15);
 add(/(sbi|paytm|phonepe|gpay|hdfc|upi).*(-|verify|secure|kyc|refund|login)|(?:secure|verify|kyc).*(sbi|paytm|upi)/.test(host),'Brand-like domain pattern','Brand and verification terms in a domain do not prove official ownership.',30);
 add(/\.(xyz|top|click|zip)$/.test(host),'Higher-caution domain pattern','This suffix is a weak heuristic, not evidence that the site is malicious.',10);
 add(/otp|password|credential|kyc|claim|refund/i.test(url.pathname+url.search),'Sensitive action in URL','The URL suggests a credential, identity, or reward-related action.',15);
 return finish(signals);
}
export const messageSamples = [
 {name:'KYC threat', text:'URGENT: Your SBI account will be blocked within 30 minutes. Verify KYC immediately at https://sbi-verify.example.com and share your OTP with our support team.'},
 {name:'Reward trap',text:'You won a reward of Rs 5,000! Pay a processing fee to receive your prize. Install AnyDesk for assistance.'},
 {name:'Everyday message',text:'Hi, dinner was Rs 450 each. Please check my saved contact and send your share when you have time. Thanks!'},
 {name:'Payment receipt',text:'Your payment of Rs 250 to Green Cafe was successful. Open your payment app to view the receipt.'}
];
