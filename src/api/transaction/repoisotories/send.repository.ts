import Send from "src/models/send";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Send)
export default class SendRepository extends Repository<Send> {

}