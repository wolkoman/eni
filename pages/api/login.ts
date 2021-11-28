import {NextApiRequest, NextApiResponse} from 'next';
import {cockpit} from '../../util/cockpit-sdk';
import {resolveGroup} from '../../util/verify';
import {sign} from 'jsonwebtoken';
import {User} from 'cockpit-sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  let body = JSON.parse(req.body);

  const persons = await cockpit.collectionGet('person', {filter: {username: body.username, code: body.password}});
  const secretOrPrivateKey = Buffer.from(process.env.PRIVATE_KEY!, 'base64');
  console.log(persons, secretOrPrivateKey);

  if(persons.entries.length === 1){
    const person = persons.entries[0];
    const group = resolveGroup(person.competences);
    const userlikeObject: User = {...person, group, api_key: `person_${person._id}`};
    res.json({jwt: sign(userlikeObject, secretOrPrivateKey, { algorithm: 'RS256'})});
  }else{
    const user = await cockpit.authUser(body.username, body.password);
    res.status('error' in user ? 401 : 200).json({jwt: sign(user, secretOrPrivateKey, { algorithm: 'RS256'})});
  }
}