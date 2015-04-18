var sort_by = function(field, reverse, primer) {
	var key = function (x) {return primer ? primer(x[field]) : x[field]};

	return function (a,b) {
		var A = key(a), B = key(b);
		return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1,1][+!!reverse];                  
	}
}

censusSOE = {
	// Pattern Globals
	// http://census.daybreakgames.com/get/ps2:v2/outfit/?name=Derp%20Company
	BASE_URL: 'https://census.daybreakgames.com/',
	CENSUS_URL: 'https://census.daybreakgames.com/s:OverwolfPS2App/',
	
	// Games
	G_PS2_LATEST: 'ps2:v2/',
	G_PS2_V2: 'ps2:v2/',
	//G_PS2_V2: 'ps2:v1/',
	//G_PS2_BETA: 'ps2-beta/',
	
	// Verbs
	V_Get: 'get/',
	V_Count: 'count/',
	V_Image: 'files/ps2/images/static/',
	
	// Collections
	C_Outfits: 'outfit/',
	C_OutfitMembers: 'outfit_member/',
	C_CharacterItems: 'characters_item/',
	C_Character: 'character/',
	C_Items: 'item/',
	C_Image: 'icon/',
	C_CharacterFriends: 'characters_friend/',
	C_CharacterCurrency: 'characters_currency/',	
	C_CharacterEvents: 'characters_event/',
	C_Factions: 'faction/',
	C_Profile: 'profile',
	// ImageTypes
	I_Item: '/item',
	    
	// Returns the '<img>'
	GetImage: function (id, callback) {
		var url = censusSOE.BASE_URL + censusSOE.V_Image + id + ".png";
		//Old format -> http://census.daybreakgames.com/img/game/collection/id[/imageType]
		//New format -> https://census.daybreakgames.com/files/ps2/images/static/5391.png
		callback($('<img>').attr('src', url));
	},
	
	// GetData Function Signatures
	// GetData (game, collection, id, data, callback)
	// GetData (game, collection, id, callback)
	GetData: function (game, collection, id, data, callback) {
		var url = censusSOE.CENSUS_URL + censusSOE.V_Get + game + collection + id;
		// http://census.daybreakgames.com/get/game/collection/id[/?clauses]'
		
		if (!callback) {
			callback = data;
			data = {};
		}
		
		$.ajax({
			url: url,
			dataType: "jsonp",
			success: function (data) {
				callback(data);
			},
			error: function (e) {
				alert('Error: ' + e.message);
			}
		});
	},
	
	// Cond Function Signatures
	// Cond (id, condition)
	// Cond (condition)
	Cond: function (id, condition) {
		var delimiter = '?';
		if (!condition) {
			condition = id;
			id = "";
		}
		else {
			delimiter = '/?';
		}
		
		return id + delimiter + condition;
	},
	GetFullProfileById: function (characterId, callback) {
		//http://census.daybreakgames.com/get/ps2/C_Character/?character_id=characterId&c:resolve=profile,faction,stat,weapon_stat,online_status,outfit,currency&c:join=type:profile^inject_at:profile^show:image_id&c:join=type:faction^inject_at:faction^show:image_id
		var clause = 'character_id=' + characterId + "&c:resolve=character_name&c:resolve=profile,faction,online_status,outfit,currency&c:join=type:profile^inject_at:profile^show:image_id&c:join=type:faction^inject_at:faction^show:image_id";
		censusSOE.GetData(censusSOE.G_PS2_V2, censusSOE.C_Character, censusSOE.Cond(clause), function (json) {
			callback(json.character_list[0]);
		});
	},
	GetOutfitOnlineMembersById: function (outfitId, callback) {
		//New-> http://census.daybreakgames.com/get/ps2:v2/outfit_member?outfit_id=37509488620628689&c:limit=1000&c:resolve=online_status,character(name,battle_rank,profile_id)&c:join=type:profile^list:0^inject_at:profile^show:image_id^on:character.profile_id^to:profile_id 
		var clause = 'outfit_id=' + outfitId +                                           '&c:limit=2000&c:resolve=online_status,character(name,battle_rank,profile_id)&c:join=type:profile^list:0^inject_at:profile^show:image_id^on:character.profile_id^to:profile_id';
		var tools = censusSOE;
		
		if(typeof outfitId === 'undefined' || !outfitId){
			callback();
		};
					
		censusSOE.GetData(censusSOE.G_PS2_V2, censusSOE.C_OutfitMembers, censusSOE.Cond(clause), function (json) {
			var outfit = json;
			outfit.online_members = [];
				
			for (var i = 0; i < outfit.outfit_member_list.length; ++i) {
				if (outfit.outfit_member_list[i].online_status != 0)
					outfit.online_members.push(outfit.outfit_member_list[i]);
			}
							
			callback(outfit);
		});
	},
	GetCharacterIdByName: function (characterName, callback) {
		//http://census.daybreakgames.com/get/ps2:v2/character/?name.first_lower=litebrite&c:show=character_id,name&c:resolve=world,outfit
		var clause = 'name.first_lower=' + characterName.toLowerCase() + '&c:show=character_id,name,world&c:resolve=outfit,world';
		censusSOE.GetData(censusSOE.G_PS2_V2, censusSOE.C_Character, censusSOE.Cond(clause), function (json) {
			callback(json.character_list);
		});
	},
	GetKillboardById: function (characterId, size, callback) {
        //http://census.daybreakgames.com/get/ps2:v2/characters_event/?character_id=5428010618041058369&c:limit=15&type=DEATH,KILL&c:resolve=character(name,battle_rank,faction_id,profile_id),attacker(name,battle_rank,faction_id,profile_id)&c:join=type:vehicle^on:attacker_vehicle_id^to:vehicle_id^inject_at:vehicle^show:name&c:lang=en&c:join=type:item^on:attacker_weapon_id^to:item_id^inject_at:weapon^show:name&c:lang=en&c:join=type:profile^on:character.profile_id^to:profile_id^inject_at:profile^show:image_id&c:join=type:profile^on:attacker.profile_id^to:profile_id^inject_at:profile^show:image_id&c:join=type:faction^on:attacker.faction_id^to:faction_id^inject_at:faction^show:image_id&c:join=type:faction^on:character.faction_id^to:faction_id^inject_at:faction^show:image_id
        var clause = 'character_id=' + characterId + "&c:limit=15&type=DEATH,KILL&c:resolve=character(name,battle_rank,faction_id,profile_id),attacker(name,battle_rank,faction_id,profile_id)&c:join=type:vehicle^on:attacker_vehicle_id^to:vehicle_id^inject_at:vehicle^show:name&c:lang=en&c:join=type:item^on:attacker_weapon_id^to:item_id^inject_at:weapon^show:name&c:lang=en&c:join=type:profile^on:character.profile_id^to:profile_id^inject_at:profile^show:image_id&c:join=type:profile^on:attacker.profile_id^to:profile_id^inject_at:profile^show:image_id&c:join=type:faction^on:attacker.faction_id^to:faction_id^inject_at:faction^show:image_id&c:join=type:faction^on:character.faction_id^to:faction_id^inject_at:faction^show:image_id";
		censusSOE.GetData(censusSOE.G_PS2_V2, censusSOE.C_CharacterEvents, censusSOE.Cond(clause), function (json) {
			callback(json.characters_event_list);
		});
	},
	GetCharacterResourceById: function (playerId, callback) {
		var clause = 'character_id='+playerId;
		censusSOE.GetData(censusSOE.G_PS2_V2, censusSOE.C_CharacterCurrency, censusSOE.Cond(clause), function (json) {
			var currency_list = json.characters_currency_list[0];
			callback(currency_list);
		});	
	},
	GetStatsById: function (characterId, callback) {
		//http://census.daybreakgames.com/get/ps2:v2/character/?character_id=5428010618041058369&c:resolve=stat_history&c:hide=name,battle_rank,certs,times,daily_ribbon
		var clause = 'character_id=' + characterId + "&c:resolve=stat_history&c:hide=name,battle_rank,certs,times,daily_ribbon";
		var tools = censusSOE;
		censusSOE.GetData(censusSOE.G_PS2_V2, censusSOE.C_Character, censusSOE.Cond(clause), function (json) {
			callback(json.character_list[0].stats);
		});
	}
};
