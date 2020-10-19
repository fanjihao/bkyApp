import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

class UserAgree extends Component {
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        return (
            <View style={{ paddingTop: 30 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.back}>
                        <Feather name="chevron-left" size={24}  />
                    </TouchableOpacity>
                    <Text>用户协议与隐私政策</Text>
                    <View style={{ width: 30 }}></View>
                </View>
                <ScrollView contentContainerStyle={{ width: '100%', alignItems: 'center', justifyContent: 'center', flexGrow: 1, paddingLeft: 15, paddingRight: 15 }}>
                    <View style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, color: 'orange' }}>用户协议</Text>
                    </View>
                    <Text>一、特别提示在此特别提醒您在注册成为博客云用户之前，请认真阅读本《用户协议》（以下简称“协议”），
                    确保您充分理解本协议中各条款。请您审慎阅读并选择接受或不接受本协议。
                    您同意并点击确认本协议条款且完成注册程序后，才能成为博客云的正式注册用户，并享受博客云的各类服务。
                    您的注册、登录、使用等行为将视为对本协议的接受，并同意接受本协议各项条款的约束。
                    若您不同意本协议，或对本协议中的条款存在任何疑问，请您立即停止博客云用户注册程序，
                    并可以选择不使用本网站服务。本协议约定博客云与用户之间关于“博客云”服务（以下简称“服务”）的权利义务。
                    “用户”是指注册、登录、使用本服务的个人、单位。本协议可由博客云随时更新，
                    更新后的协议条款一旦公布即代替原来的协议条款，恕不再另行通知，用户可在本APP中查阅最新版协议条款。
                    在修改协议条款后，如果用户不接受修改后的条款，请立即停止使用博客云提供的服务，
                                        用户继续使用博客云提供的服务将被视为接受修改后的协议。</Text>
                    <Text style={styles.title}>二、账号注册</Text>
                    <Text>1、用户在使用本服务前需要注册一个“博客云”账号。
                    “博客云”账号应当使用手机号码绑定注册，请用户使用尚未与“博客云”账号绑定的手机号码，
                    以及未被博客云根据本协议封禁的手机号码注册“博客云”账号。
                    博客云可以根据用户需求或产品需要对账号注册和绑定的方式进行变更，
                    而无须事先通知用户。
                                    </Text>
                    <Text>2、如果注册申请者有被博客云封禁的先例或涉嫌虚假注册及滥用他人名义注册，
                                        及其他不能得到许可的理由，博客云将拒绝其注册申请。</Text>
                    <Text>3、鉴于“博客云”账号的绑定注册方式,您同意博客云在注册时将允许您的手机号码及手机设备识别码等信息用于注册。</Text>
                    <Text>4、在用户注册及使用本服务时,博客云需要搜集能识别用户身份的个人信息以便博客云可以在必要时联系用户,或为用户提供更好的使用体验。
                    博客云搜集的信息包括但不限于用户的姓名、地址;博客云同意对这些信息的使用将受限于第三条用户个人隐私信息保护的约束。
                                    </Text>
                    <Text style={styles.title}>三、账户安全</Text>
                    <Text>1、用户一旦注册成功,成为博客云的用户,将得到一个用户名和密码,并有权利使用自己的用户名及密码随时进行登陆博客云
                                    </Text>
                    <Text>2、用户对用户名和密码的安全负全部责任,同时对以其用户名进行的所有活动和事件负全责。</Text>
                    <Text>3、用户不得以任何形式擅自转让或授权他人使用自己的博客云用户名。</Text>
                    <Text>4、用户对密码加以妥善保管,切勿将密码告知他人,因密码保管不善而造成的所有损失由用户自行承担。
                                    </Text>
                    <Text>
                        5、如果用户泄漏了密码,有可能导致不利的法律后果,因此不管任何原因导致用户的密码安全受到威胁,应该立即和博客云客服人员取得联系,否则后果自负。
                                    </Text>
                    <Text style={styles.title}>四、用户声明与保证</Text>
                    <Text>1、用户承诺其为具有完全民事行为能力的民事主体,且具有达成交易履行其义务的能力。
                                    </Text>
                    <Text>2、用户有义务在注册时提供自己的真实资料,并保证诸如手机号码、姓名、所在地区等内容的有效性及安全性,保证博客云工作人员可以通过上述联系方式与用户取得联系。
                                        同时,用户也有义务在相关资料实际变更时及时更新有关注册资料。</Text>
                    <Text>3、用户通过使用博客云的过程中所制作、上载、复制、发布、传播的任何內容,
                    包括但不限于账号头像、名称、用户说明等注册信息及认证资料,或文字、语音、图片、视频、图文等发
                    送、回复和相关链接页面,以及其他使用账号或本服务所产生的内容,不得违反国家相关法律制度,包含但不限于如下原则:
                                    </Text>
                    <Text style={styles.leftText}>(1)违反宪法所确定的基本原则的；</Text>
                    <Text style={styles.leftText}>(2)危害国家安全,泄露国家秘密,颠覆国家政权,破坏国家统一的；</Text>
                    <Text style={styles.leftText}>(3)损害国家荣誉和利益的；</Text>
                    <Text style={styles.leftText}>(4)煽动民族仇恨、民族歧视,破坏民族团结的；</Text>
                    <Text style={styles.leftText}>(5)破坏国家宗教政策,宣扬邪教和封建迷信的；</Text>
                    <Text style={styles.leftText}>(6)散布谣言,扰乱社公秩序,破坏社会稳定的；</Text>
                    <Text style={styles.leftText}>(7)散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</Text>
                    <Text style={styles.leftText}>(8)侮辱或者诽谤他人,侵害他人合法权益的；</Text>
                    <Text style={styles.leftText}>(9)含有法律、行政法规禁止的其他内容的。</Text>
                    <Text>4、用户不得利用“博客云”账号或本服务制作、上载、复制、发布、传播下干扰“博客云”的正常运营,
                    以及侵犯其他用户或第三方合法权益的内容：
                                    </Text>
                    <Text style={styles.leftText}>(1)含有任何性或性暗示的；</Text>
                    <Text style={styles.leftText}>(2)含有辱骂、恐吓、威胁内容的；</Text>
                    <Text style={styles.leftText}>(3)含有骚扰、垃圾广告、恶意信息、诱骗信息的；</Text>
                    <Text style={styles.leftText}>(4)涉及他人隐私、个人信息或资料的；</Text>
                    <Text style={styles.leftText}>(5)侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的；</Text>
                    <Text style={styles.leftText}>(6)含有其他干扰本服务正常运营和侵犯其他用户或第三方合法权益内容的信息。</Text>
                    <Text style={styles.title}>五、服务内容</Text>
                    <Text>1、博客云是针对美容健康行业的一款零息分期赊销App，结合公司集团与用户的实际，
                    帮助加盟商家门店与同行业公司门店引流和管理店铺，帮助顾客无负担大胆享受美容健康服务。
                    引导健康美容行业店铺转型升级、实现轻松长久盈利；
                    帮助投资人了解与参与互联网+新型健康美容服务项目；提高行业服务质量，
                    为客户群体提供更好的服务质量与保障！
                                    </Text>
                    <Text>2、博客云有权随时审核或删除用户发布/传播的涉嫌违法或违反社会主义精神文明,
                                        或者被博客云认为不妥当的内容(包括但不限于文字、语音、图片、视频图文等)。</Text>
                    <Text>4、所有发给用户的通告及其他消息都可通过APP或者用户所提供的联系方式发送。</Text>
                    <Text style={styles.title}>六、服务的终止</Text>
                    <Text>1、在下列情况下,博客云有权终止向用户提供服务；
                                    </Text>
                    <Text style={styles.leftText}>
                        （1）在用户违反本服务协议相关规定时，博客云有权终止向该用户提供服务；如该用户再一次直接或间接或以他人名义注册为用户的，
                        一经发现，博客云有权直接单方面终止向该用户提供服务；
                                    </Text>
                    <Text style={styles.leftText}>（2）如博客云通过用户提供的信息与用户联系时，发现用户在注册时填写的联系方式已不存在或无法接通，
                    博客云以其它联系方式通知用户更改，而用户在三个工作日内仍未能提供新的联
                    系方式，博客云有权终止向该用户提供服务；
                                    </Text>
                    <Text style={styles.leftText}>（3）用户不得通过程序或人工方式进行刷量或作弊，若发现用户有作弊行为，
                                    博客云将立即终止服务，并有权扣留账户内金额；</Text>
                    <Text style={styles.leftText}>
                        （4）一旦博客云发现用户提供的数据或信息中含有虚假内容，博客云有权随时终止向该用户提供服务；
                                    </Text>
                    <Text style={styles.leftText}>
                        （5）本服务条款终止或更新时，用户明示不愿接受新的服务条款；
                                    </Text>
                    <Text style={styles.leftText}>
                        （6）以及其他博客云认为需要终止服务的情况。
                                    </Text>
                    <Text>2、服务终止后，博客云没有义务为用户保留原账号中或与之相关的任何信息，
                    或转发任何未曾阋读或发送的信息给用户或第三方。
                                    </Text>
                    <Text style={styles.leftText}>
                        3、用户理解并同意，即便在本协议终止及用户的服务被终止后，博客云仍有权：
                                    </Text>
                    <Text style={styles.leftText}>（1）继续续保存您的用户信息；
                                    </Text>
                    <Text style={styles.leftText}>（2）继续向用户主张在其使用百姓网平台服务期间因违反法律法规、本协议及平台规则而应承担的责任。</Text>
                    <Text style={styles.title}>七、服务的变更、中断</Text>
                    <Text>1、鉴于网络服务的特殊性，用户需同意博客云会变更、中断部分或全部的网络服务，并删除（不再保存）
                    用户在使用过程中提交的任何资料，而无需通知用户，也无需对任何用户或任何第三方承担任何责任。
                                    </Text>
                    <Text>2、博客云需要定期或不定期地对提供网络服务的平台进行检测或者更新，
                                        如因此类情况而造成网络服务在合理时间内的中断，博客云无需为此承担任何责任。</Text>
                    <Text style={styles.title}>八、服务条款修改</Text>
                    <Text>1、博客云有权随时修改本服务条款的任何内容，一旦本服务条款的任何内容发生变动，
                    博客云将会通过适当方式向用户提示修改内容。
                                    </Text>
                    <Text>2、如果不同意博客云对本服务条款所做的修改，用户有权停止使用网络服务。</Text>
                    <Text>3、如果用户继续使用网络服务，则视为用户接受博客云对本服务条款所做的修改。</Text>
                    <Text style={styles.title}>九、免责与赔偿声明</Text>
                    <Text>1、若博客云已经明示其服务提供方式发生变更并提醒用户应当注意事项，
                    用户未按要求操作所产生的一切后果由用户自行承担。
                                    </Text>
                    <Text>2、用户明确同意其使用博客云所存在的风险将完全由其自己承担，因其使用博客云而产生的一切后果也由其自己承担。</Text>
                    <Text>3、用户同意保障和维护博客云及其他用户的利益，由于用户在使用博客云有违法、不真实、不正当、侵犯第三方合法权益的行为，
                                        或用户违反本协议项下的任何条款而给博客云及任何其他第三方造成损失，用户同意承担由此造成的损害赔偿责任。</Text>
                    <Text style={styles.title}>十、隐私声明</Text>
                    <Text style={styles.leftText}>1、适用范围：
                                    </Text>
                    <Text style={styles.leftText}>（1）在用户注册博客云账户时，根据要求提供的个人注册信息；</Text>
                    <Text>（2）在用户使用博客云，或访问其相关网页时，博客云自动接收并记录的用户浏览器上的服务器数值，
                                        包括但不限于IP地址等数据及用户要求取用的网页记录。</Text>
                    <Text style={styles.leftText}>2、信息使用：
                                    </Text>
                    <Text style={styles.leftText}>（1）博客云不会向任何人出售或出借用户的个人信息，除非事先得到用户的许可；</Text>
                    <Text>（2）博客云亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播用户的个人信息。
                                        任何用户如从事上述活动，一经发现，博客云有权立即终止与该用户的服务协议，查封其账号；</Text>
                    <Text style={styles.leftText}>（3）为达到服务用户的目的，博客云可能通过使用用户的个人信息，向用户提供服务，
                                    包括但不限于向用户发出产品和服务信息，或者与博客云合作伙伴共享信息以便他们向用户发送有关其产品和服务的信息。</Text>
                    <Text>3、信息披露：用户的个人信息将在下述情況下部分或全部被披露：</Text>
                    <Text style={styles.leftText}>（1）经用用户同意，向第三方披露； </Text>
                    <Text style={styles.leftText}>（2）根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露；</Text>
                    <Text style={styles.leftText}>（3）如果用户出现违反中国有关法律或者网站政策的情况，需要向第三方披露；</Text>
                    <Text style={styles.leftText}>（4）为提供用户所要求的产品和服务，而必须和第三方分享用户的个人信息；</Text>
                    <Text style={styles.leftText}>（5）其它博客云根据法律或者网站政策认为合适的披露；</Text>
                    <Text style={styles.leftText}>（6）用户使用博客云时提供的银行账户信息，博客云将严格履行关保密约定。</Text>
                    <Text style={styles.title}>十一、其他</Text>
                    <Text style={styles.leftText}>1、博客云郑重提醒用户注意本协议中免除博客云来责任和和限制用户权利的条款，请用户仔细阅读，
                    自主考虑风险。未成年人应在法定监护人的陪同下阅读本协议。
                                    </Text>
                    <Text style={styles.leftText}>2、本协议的效力、解释及纠纷的解决，适用于中华人民共和国法律。若用户和博客云
                    之间发生任何纠纷或争议，首先应友好协解决，协商不成的，用户同意将纠纷或争议提交博客云住所地有管辖权的人民法院管辖。
                                    </Text>
                    <Text style={styles.leftText}>3、本协议的任何条款无论因何种原因无效或不具可执行性，其余条款仍有效，对双方具有约束力。
                                    </Text>
                    <Text style={styles.leftText}>4、本协议最终解释权归博客云有限公司所有，并且保留一切解释和修改的权力。
                                    </Text>
                    <Text style={styles.leftText}>5、本协议自2020年10月01日起适用。
                                    </Text>

                    <View style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, color: 'orange' }}>隐私政策</Text>
                    </View>
                    <Text>本应用非常重视用户隐私政策并严格遵守相关的法律规定。请您仔细阅读《隐私政策》后再继续使用。如果您继续使用我们的服务，表示您已经充分阅读和理解我们协议的全部内容。</Text>
                    <Text>
                    本app尊重并保护所有使用服务用户的个人隐私权。为了给您提供更准确、更优质的服务，
                    本应用会按照本隐私权政策的规定使用和披露您的个人信息。除本隐私权政策另有规定外，
                    在未征得您事先许可的情况下，本应用不会将这些信息对外披露或向第三方提供。本应用会不时更新本隐私权政策。 
                    您在同意本应用服务使用协议之时，即视为您已经同意本隐私权政策全部内容。
                    </Text>
                    <Text style={styles.title}>
                    1. 适用范围
                    </Text>
                    <Text style={styles.leftText}>
                    (1) 在您注册本应用app帐号时，您根据app要求提供的个人注册信息；
                    </Text>
                    <Text style={styles.leftText}>
                    (2) 在您使用本应用网络服务，或访问本应用平台网页时，本应用自动接收并记录的您的浏览器和计算机上的信息，包括但不限于您的IP地址、
                    浏览器的类型、使用的语言、访问日期和时间、软硬件特征信息及您需求的网页记录等数据；
                    </Text>
                    <Text style={styles.leftText}>
                    (3) 本应用通过合法途径从商业伙伴处取得的用户个人数据;
                    </Text>
                    <Text style={styles.leftText}>
                    (4)本应用严禁用户发布不良信息，如裸露、色情和亵渎内容，发布的内容我们会进行审核，
                    一经发现不良信息，会禁用该用户的所有权限，予以封号处理。
                    </Text>
                    <Text style={styles.title}>
                    2. 信息使用
                    </Text>
                    <Text style={styles.leftText}>
                    (1)本应用不会向任何无关第三方提供、出售、出租、分享或交易您的个人登录信息。
                    如果我们存储发生维修或升级，我们会事先发出推送消息来通知您，请您提前允许本应用消息通知。
                    </Text>
                    <Text style={styles.leftText}>
                    (2) 本应用亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播您的个人信息。
                    任何本应用平台用户如从事上述活动，一经发现，本应用有权立即终止与该用户的服务协议。
                    </Text>
                    <Text style={styles.leftText}>
                    (3) 为服务用户的目的，本应用可能通过使用您的个人信息，向您提供您感兴趣的信息，包括但不限于向您发出产品和服务信息，
                    或者与本应用合作伙伴共享信息以便他们向您发送有关其产品和服务的信息（后者需要您的事先同意）。
                    </Text>
                    <Text style={styles.title}>
                    3. 信息披露
                    </Text>
                    <Text style={styles.leftText}>
                    在如下情况下，本应用将依据您的个人意愿或法律的规定全部或部分的披露您的个人信息：
                    </Text>
                    <Text style={styles.leftText}>
                    (1) 未经您事先同意，我们不会向第三方披露；
                    </Text>
                    <Text style={styles.leftText}>
                    (2)为提供您所要求的产品和服务，而必须和第三方分享您的个人信息；
                    </Text>
                    <Text style={styles.leftText}>
                    (3) 根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露；
                    </Text>
                    <Text style={styles.leftText}>
                    (4) 如您出现违反中国有关法律、法规或者本应用服务协议或相关规则的情况，需要向第三方披露；
                    </Text>
                    <Text style={styles.leftText}>
                    (5) 如您是适格的知识产权投诉人并已提起投诉，应被投诉人要求，向被投诉人披露，以便双方处理可能的权利纠纷；
                    </Text>
                    <Text style={styles.title}>
                    4. 信息存储和交换
                    </Text>
                    <Text style={styles.leftText}>
                    本应用收集的有关您的信息和资料将保存在本应用及（或）其关联公司的服务器上，这些信息和资料可能传送至您所在国家
                    、地区或本应用收集信息和资料所在地的境外并在境外被访问、存储和展示。
                    </Text>
                    <Text style={styles.title}>
                    5. Cookie的使用
                    </Text>
                    <Text style={styles.leftText}>
                    (1) 在您未拒绝接受cookies的情况下，本应用会在您的计算机上设定或取用cookies ，以便您能登录或使用依赖于cookies的本应用平台服务或功能。
                    本应用使用cookies可为您提供更加周到的个性化服务，包括推广服务。
                    </Text>
                    <Text style={styles.leftText}>
                    (2) 您有权选择接受或拒绝接受cookies。您可以通过修改浏览器设置的方式拒绝接受cookies。
                    但如果您选择拒绝接受cookies，则您可能无法登录或使用依赖于cookies的本应用网络服务或功能。
                    </Text>
                    <Text style={styles.leftText}>
                    (3) 通过本应用所设cookies所取得的有关信息，将适用本政策。
                    </Text>
                    <Text style={styles.title}>
                    6.本隐私政策的更改
                    </Text>
                    <Text style={styles.leftText}>
                    (1)如果决定更改隐私政策，我们会在本政策中、本公司网站中以及我们认为适当的位置发布这些更改，
                    以便您了解我们如何收集、使用您的个人信息，哪些人可以访问这些信息，以及在什么情况下我们会透露这些信息。
                    </Text>
                    <Text style={styles.leftText}>
                    (2)本公司保留随时修改本政策的权利，因此请经常查看。如对本政策作出重大更改，本公司会通过网站通知的形式告知。
                    </Text>
                    <Text style={styles.leftText}>
                    方披露自己的个人信息，如联络方式或者邮政地址。请您妥善保护自己的个人信息，仅在必要的情形下向他人提供。
                    如您发现自己的个人信息泄密，尤其是本应用用户名及密码发生泄露，请您立即联络本应用客服，以便本应用采取相应措施。
                    </Text>
                    <Text style={styles.leftText}>
                    感谢您花时间了解我们的隐私政策！我们将尽全力保护您的个人信息和合法权益，再次感谢您的信任！
                    </Text>
                    <Text style={{height:100}}></Text>
                </ScrollView>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    header: {
        height: 50,
        width: '100%',
        backgroundColor: '#F2F2F2',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        borderColor: '#eee'
    },
    leftText: {
        width:'100%',
        textAlign:"left"
    },
    title: { 
        width: '100%', 
        textAlign: 'left', 
        marginTop: 5, 
        marginBottom: 5 
    }
})

export default UserAgree