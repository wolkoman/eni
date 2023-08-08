import {NextApiRequest, NextApiResponse} from 'next';
import {fetchCurrentWeeklies, fetchWeeklies, fetchWeeklyEdition} from "@/app/(shared)/Weekly";

export default async function handler(req: NextApiRequest, res: NextApiResponse){

    const parish: 'emmaus' = (req.query as unknown as {parish: 'emmaus'}).parish;
    if(!["emmaus","inzersdorf","neustift"].includes(parish)){
        res.write("Diese Pfarre existiert nicht!");
        res.end();
        return;
    }

    res.redirect(fetchWeeklyEdition(await fetchCurrentWeeklies(), parish));
}
