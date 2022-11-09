import {NextApiRequest, NextApiResponse} from 'next';
import {fetchWeeklies} from "../../util/fetchWeeklies";
import {getCockpitResourceUrl} from "../../components/Articles";

export default async function handler(req: NextApiRequest, res: NextApiResponse){

    const parish: string  = (req.query as unknown as {parish: string}).parish;
    if(!["emmaus","inzersdorf","neustift"].includes(parish)){
        res.write("Diese Pfarre existiert nicht!");
        res.end();
        return;
    }

    const weeklies = await fetchWeeklies();
    // @ts-ignore
    const file = getCockpitResourceUrl(weeklies.find(weekly => weekly.emmaus && weekly.inzersdorf && weekly.neustift)![parish])
    res.redirect(file);
}
