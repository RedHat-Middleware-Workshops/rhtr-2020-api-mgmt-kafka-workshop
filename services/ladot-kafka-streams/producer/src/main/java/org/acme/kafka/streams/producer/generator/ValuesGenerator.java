package org.acme.kafka.streams.producer.generator;

import java.util.concurrent.TimeUnit;

import javax.enterprise.context.ApplicationScoped;

import org.eclipse.microprofile.reactive.messaging.Outgoing;
import org.jboss.logging.Logger;

import io.reactivex.Flowable;
import io.smallrye.reactive.messaging.kafka.KafkaRecord;

/**
 * A bean producing a set CDC event for the "meter" and "meter_update" tables every few seconds.
 * Refer to the application.properties to see the topics these outgoing channels map to.
 */
@ApplicationScoped
public class ValuesGenerator {

    private static final Logger LOG = Logger.getLogger(ValuesGenerator.class);

    @Outgoing("meter-update-event")
    public Flowable<KafkaRecord<String, String>> generate() {
        return Flowable.interval(2000, TimeUnit.MILLISECONDS)
                .onBackpressureDrop()
                .map(tick -> {
                    LOG.info("generating 'meter_update' table change event");
                    return KafkaRecord.of(
                        "F6PeB2XQRYG-8EN5yFcrP",
                        "{'schema':{'type':'struct','fields':[{'type':'struct','fields':[{'type':'int32','optional':false,'field':'id'},{'type':'string','optional':false,'field':'meter_id'},{'type':'int64','optional':false,'name':'io.debezium.time.MicroTimestamp','version':1,'field':'timestamp'},{'type':'string','optional':false,'field':'status_text'}],'optional':true,'name':'city_info.updates.public.meter_update.Value','field':'before'},{'type':'struct','fields':[{'type':'int32','optional':false,'field':'id'},{'type':'string','optional':false,'field':'meter_id'},{'type':'int64','optional':false,'name':'io.debezium.time.MicroTimestamp','version':1,'field':'timestamp'},{'type':'string','optional':false,'field':'status_text'}],'optional':true,'name':'city_info.updates.public.meter_update.Value','field':'after'},{'type':'struct','fields':[{'type':'string','optional':false,'field':'version'},{'type':'string','optional':false,'field':'connector'},{'type':'string','optional':false,'field':'name'},{'type':'int64','optional':false,'field':'ts_ms'},{'type':'string','optional':true,'name':'io.debezium.data.Enum','version':1,'parameters':{'allowed':'true,last,false'},'default':'false','field':'snapshot'},{'type':'string','optional':false,'field':'db'},{'type':'string','optional':false,'field':'schema'},{'type':'string','optional':false,'field':'table'},{'type':'int64','optional':true,'field':'txId'},{'type':'int64','optional':true,'field':'lsn'},{'type':'int64','optional':true,'field':'xmin'}],'optional':false,'name':'io.debezium.connector.postgresql.Source','field':'source'},{'type':'string','optional':false,'field':'op'},{'type':'int64','optional':true,'field':'ts_ms'},{'type':'struct','fields':[{'type':'string','optional':false,'field':'id'},{'type':'int64','optional':false,'field':'total_order'},{'type':'int64','optional':false,'field':'data_collection_order'}],'optional':true,'field':'transaction'}],'optional':false,'name':'city_info.updates.public.meter_update.Envelope'},'payload':{'before':null,'after':{'id':9,'meter_id':'F6PeB2XQRYG-8EN5yFcrP','timestamp':1601316823000000,'status_text':'unknown'},'source':{'version':'1.2.4.Final','connector':'postgresql','name':'city-info.updates','ts_ms':1601388944339,'snapshot':'false','db':'city-info','schema':'public','table':'meter_update','txId':510,'lsn':30217968,'xmin':null},'op':'c','ts_ms':1601388944561,'transaction':null}}".replace('\'', '"')
                    );
                });
    }

    @Outgoing("meter-info-event")
    public Flowable<KafkaRecord<String, String>> meters() {

        return Flowable.interval(10000, TimeUnit.MILLISECONDS)
                .onBackpressureDrop()
                .map(tick -> {
                    LOG.info("generating 'meter' table change event");
                    return KafkaRecord.of(
                        "F6PeB2XQRYG-8EN5yFcrP",
                        "{'schema':{'type':'struct','fields':[{'type':'struct','fields':[{'type':'string','optional':false,'field':'id'},{'type':'string','optional':false,'field':'address'},{'type':'string','optional':false,'field':'latitude'},{'type':'string','optional':false,'field':'longitude'}],'optional':true,'name':'city_info.updates.public.meter.Value','field':'before'},{'type':'struct','fields':[{'type':'string','optional':false,'field':'id'},{'type':'string','optional':false,'field':'address'},{'type':'string','optional':false,'field':'latitude'},{'type':'string','optional':false,'field':'longitude'}],'optional':true,'name':'city_info.updates.public.meter.Value','field':'after'},{'type':'struct','fields':[{'type':'string','optional':false,'field':'version'},{'type':'string','optional':false,'field':'connector'},{'type':'string','optional':false,'field':'name'},{'type':'int64','optional':false,'field':'ts_ms'},{'type':'string','optional':true,'name':'io.debezium.data.Enum','version':1,'parameters':{'allowed':'true,last,false'},'default':'false','field':'snapshot'},{'type':'string','optional':false,'field':'db'},{'type':'string','optional':false,'field':'schema'},{'type':'string','optional':false,'field':'table'},{'type':'int64','optional':true,'field':'txId'},{'type':'int64','optional':true,'field':'lsn'},{'type':'int64','optional':true,'field':'xmin'}],'optional':false,'name':'io.debezium.connector.postgresql.Source','field':'source'},{'type':'string','optional':false,'field':'op'},{'type':'int64','optional':true,'field':'ts_ms'},{'type':'struct','fields':[{'type':'string','optional':false,'field':'id'},{'type':'int64','optional':false,'field':'total_order'},{'type':'int64','optional':false,'field':'data_collection_order'}],'optional':true,'field':'transaction'}],'optional':false,'name':'city_info.updates.public.meter.Envelope'},'payload':{'before':null,'after':{'id':'F6PeB2XQRYG-8EN5yFcrP','address':'1700 S MAPLE AVE','latitude':'34.030464','longitude':'-118.26045'},'source':{'version':'1.2.4.Final','connector':'postgresql','name':'city-info.updates','ts_ms':1601387030278,'snapshot':'true','db':'city-info','schema':'public','table':'meter','txId':504,'lsn':30207128,'xmin':null},'op':'r','ts_ms':1601387030278,'transaction':null}}".replace('\'', '"')
                    );
                });
    }
}
