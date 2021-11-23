import Receive from "src/models/receive";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Receive)
export default class ReceiveRepository extends Repository<Receive> {

}